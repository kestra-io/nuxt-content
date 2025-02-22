import fs from 'fs';
import { useLogger, defineNuxtModule, createResolver, extendViteConfig, addImports, addComponentsDir, addTemplate, addPlugin, resolveModule } from '@nuxt/kit';
import { genSafeVariableName, genImport, genDynamicImport } from 'knitwork';
import defu from 'defu';
import { hash } from 'ohash';
import { resolve, join, relative } from 'pathe';
import { listen } from 'listhen';
import { createStorage } from 'unstorage';
import { withLeadingSlash, joinURL, withTrailingSlash } from 'ufo';
import fsDriver from 'unstorage/drivers/fs';
import httpDriver from 'unstorage/drivers/http';
import githubDriver from 'unstorage/drivers/github';
import { WebSocketServer } from 'ws';



// -- Unbuild CommonJS Shims --
import __cjs_url__ from 'url';
import __cjs_path__ from 'path';
import __cjs_mod__ from 'module';
const __filename = __cjs_url__.fileURLToPath(import.meta.url);
const __dirname = __cjs_path__.dirname(__filename);
const require = __cjs_mod__.createRequire(import.meta.url);
const name = "@nuxt/content";
const version = "2.5.2";

function makeIgnored(ignores, experimental = false) {
  ignores = ignores.map((e) => e);
  if (experimental) {
    const rxAll2 = ["/\\.", "/-", ...ignores].map((p) => new RegExp(p));
    return function isIgnored(key) {
      const path = "/" + key.replaceAll(":", "/");
      return rxAll2.some((rx) => rx.test(path));
    };
  }
  const rxAll = ["\\.", "-", ...ignores].map((p) => new RegExp(`^${p}|:${p}`));
  return function isIgnored(key) {
    return rxAll.some((rx) => rx.test(key));
  };
}

const logger = useLogger("@nuxt/content");
const CACHE_VERSION = 2;
const MOUNT_PREFIX = "content:source:";
const PROSE_TAGS = [
  "p",
  "a",
  "blockquote",
  "code-inline",
  "code",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "img",
  "ul",
  "ol",
  "li",
  "strong",
  "table",
  "thead",
  "tbody",
  "td",
  "th",
  "tr"
];
const unstorageDrivers = {
  fs: fsDriver,
  http: httpDriver,
  github: githubDriver
};
function getMountDriver(mount) {
  const dirverName = mount.driver;
  if (unstorageDrivers[dirverName]) {
    return unstorageDrivers[dirverName](mount);
  }
  try {
    return require(mount.driver).default(mount);
  } catch (e) {
    console.error("Couldn't load driver", mount.driver);
  }
}
function useContentMounts(nuxt, storages) {
  const key = (path, prefix = "") => `${MOUNT_PREFIX}${path.replace(/[/:]/g, "_")}${prefix.replace(/\//g, ":")}`;
  const storageKeys = Object.keys(storages);
  if (Array.isArray(storages) || // Detect object representation of array `{ '0': 'source1' }`. Nuxt converts this array to object when using `nuxt.config.ts`
  storageKeys.length > 0 && storageKeys.every((i) => i === String(+i))) {
    storages = Object.values(storages);
    logger.warn("Using array syntax to define sources is deprecated. Consider using object syntax.");
    storages = storages.reduce((mounts, storage) => {
      if (typeof storage === "string") {
        mounts[key(storage)] = {
          name: storage,
          driver: "fs",
          prefix: "",
          base: resolve(nuxt.options.srcDir, storage)
        };
      }
      if (typeof storage === "object") {
        mounts[key(storage.name, storage.prefix)] = storage;
      }
      return mounts;
    }, {});
  } else {
    storages = Object.entries(storages).reduce((mounts, [name, storage]) => {
      mounts[key(storage.name || name, storage.prefix)] = storage;
      return mounts;
    }, {});
  }
  const defaultStorage = key("content");
  if (!storages[defaultStorage]) {
    storages[defaultStorage] = {
      name: defaultStorage,
      driver: "fs",
      base: resolve(nuxt.options.srcDir, "content")
    };
  }
  return storages;
}
function createWebSocket() {
  const wss = new WebSocketServer({ noServer: true });
  const serve = (req, socket = req.socket, head = "") => wss.handleUpgrade(req, socket, head, (client) => wss.emit("connection", client, req));
  const broadcast = (data) => {
    data = JSON.stringify(data);
    for (const client of wss.clients) {
      try {
        client.send(data);
      } catch (err) {
      }
    }
  };
  return {
    serve,
    broadcast,
    close: () => {
      wss.clients.forEach((client) => client.close());
      return new Promise((resolve2) => wss.close(resolve2));
    }
  };
}
function processMarkdownOptions(options) {
  const anchorLinks = typeof options.anchorLinks === "boolean" ? { depth: options.anchorLinks ? 6 : 0, exclude: [] } : { depth: 4, exclude: [1], ...options.anchorLinks };
  return {
    ...options,
    anchorLinks,
    remarkPlugins: resolveMarkdownPlugins(options.remarkPlugins),
    rehypePlugins: resolveMarkdownPlugins(options.rehypePlugins)
  };
}
function resolveMarkdownPlugins(plugins) {
  if (Array.isArray(plugins)) {
    return Object.values(plugins).reduce((plugins2, plugin) => {
      const [name, pluginOptions] = Array.isArray(plugin) ? plugin : [plugin, {}];
      plugins2[name] = pluginOptions;
      return plugins2;
    }, {});
  }
  return plugins || {};
}

const module = defineNuxtModule({
  meta: {
    name,
    version,
    configKey: "content",
    compatibility: {
      nuxt: "^3.0.0-rc.3"
    }
  },
  defaults: {
    // @deprecated
    base: "",
    api: {
      baseURL: "/api/_content"
    },
    watch: {
      ws: {
        port: {
          port: 4e3,
          portRange: [4e3, 4040]
        },
        hostname: "localhost",
        showURL: false
      }
    },
    sources: {},
    ignores: [],
    locales: [],
    defaultLocale: void 0,
    highlight: false,
    markdown: {
      tags: Object.fromEntries(PROSE_TAGS.map((t) => [t, `prose-${t}`])),
      anchorLinks: {
        depth: 4,
        exclude: [1]
      }
    },
    yaml: {},
    csv: {
      delimeter: ",",
      json: true
    },
    navigation: {
      fields: []
    },
    documentDriven: false,
    experimental: {
      clientDB: false,
      stripQueryParameters: false,
      advancedIgnoresPattern: false
    }
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const resolveRuntimeModule = (path) => resolveModule(path, { paths: resolve("./runtime") });
    options.locales = Array.from(new Set([options.defaultLocale, ...options.locales].filter(Boolean)));
    const buildIntegrity = nuxt.options.dev ? void 0 : Date.now();
    if (options.base) {
      logger.warn("content.base is deprecated. Use content.api.baseURL instead.");
      options.api.baseURL = withLeadingSlash(joinURL("api", options.base));
    }
    const contentContext = {
      transformers: [],
      ...options
    };
    extendViteConfig((config) => {
      config.define = config.define || {};
      config.define["process.env.VSCODE_TEXTMATE_DEBUG"] = false;
      config.optimizeDeps = config.optimizeDeps || {};
      config.optimizeDeps.include = config.optimizeDeps.include || [];
      config.optimizeDeps.include.push("slugify");
    });
    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.prerender = nitroConfig.prerender || {};
      nitroConfig.prerender.routes = nitroConfig.prerender.routes || [];
      nitroConfig.handlers = nitroConfig.handlers || [];
      nitroConfig.handlers.push(
        {
          method: "get",
          route: `${options.api.baseURL}/query/:qid/**:params`,
          handler: resolveRuntimeModule("./server/api/query")
        },
        {
          method: "get",
          route: `${options.api.baseURL}/query/:qid`,
          handler: resolveRuntimeModule("./server/api/query")
        },
        {
          method: "get",
          route: `${options.api.baseURL}/query`,
          handler: resolveRuntimeModule("./server/api/query")
        },
        {
          method: "get",
          route: nuxt.options.dev ? `${options.api.baseURL}/cache.json` : `${options.api.baseURL}/cache.${buildIntegrity}.json`,
          handler: resolveRuntimeModule("./server/api/cache")
        }
      );
      if (!nuxt.options.dev) {
        nitroConfig.prerender.routes.unshift(`${options.api.baseURL}/cache.${buildIntegrity}.json`);
      }
      const sources = useContentMounts(nuxt, contentContext.sources);
      nitroConfig.devStorage = Object.assign(nitroConfig.devStorage || {}, sources);
      nitroConfig.devStorage["cache:content"] = {
        driver: "fs",
        base: resolve(nuxt.options.buildDir, "content-cache")
      };
      for (const source of Object.values(sources)) {
        if (source.driver === "fs" && source.base.includes(nuxt.options.srcDir)) {
          const wildcard = join(source.base, "**/*").replace(withTrailingSlash(nuxt.options.srcDir), "");
          nuxt.options.ignore.push(
            // Remove `srcDir` from the path
            wildcard,
            `!${wildcard}.vue`
          );
        }
      }
      nitroConfig.bundledStorage = nitroConfig.bundledStorage || [];
      nitroConfig.bundledStorage.push("/cache/content");
      nitroConfig.externals = defu(typeof nitroConfig.externals === "object" ? nitroConfig.externals : {}, {
        inline: [
          // Inline module runtime in Nitro bundle
          resolve("./runtime")
        ]
      });
      nitroConfig.alias = nitroConfig.alias || {};
      nitroConfig.alias["#content/server"] = resolveRuntimeModule("./server");
      const transformers = contentContext.transformers.map((t) => {
        const name2 = genSafeVariableName(relative(nuxt.options.rootDir, t)).replace(/_(45|46|47)/g, "_") + "_" + hash(t);
        return { name: name2, import: genImport(t, name2) };
      });
      nitroConfig.virtual = nitroConfig.virtual || {};
      nitroConfig.virtual["#content/virtual/transformers"] = [
        ...transformers.map((t) => t.import),
        `export const transformers = [${transformers.map((t) => t.name).join(", ")}]`,
        'export const getParser = (ext) => transformers.find(p => ext.match(new RegExp(p.extensions.join("|"),  "i")) && p.parse)',
        'export const getTransformers = (ext) => transformers.filter(p => ext.match(new RegExp(p.extensions.join("|"),  "i")) && p.transform)',
        "export default () => {}"
      ].join("\n");
    });
    addImports([
      { name: "queryContent", as: "queryContent", from: resolveRuntimeModule("./composables/query") },
      { name: "useContentHelpers", as: "useContentHelpers", from: resolveRuntimeModule("./composables/helpers") },
      { name: "useContentHead", as: "useContentHead", from: resolveRuntimeModule("./composables/head") },
      { name: "useContentPreview", as: "useContentPreview", from: resolveRuntimeModule("./composables/preview") },
      { name: "withContentBase", as: "withContentBase", from: resolveRuntimeModule("./composables/utils") },
      { name: "useUnwrap", as: "useUnwrap", from: resolveRuntimeModule("./composables/utils") }
    ]);
    await addComponentsDir({
      path: resolve("./runtime/components"),
      pathPrefix: false,
      prefix: "",
      global: true
    });
    const componentsContext = { components: [] };
    nuxt.hook("components:extend", (newComponents) => {
      componentsContext.components = newComponents.filter((c) => {
        if (c.pascalName.startsWith("Prose") || c.pascalName === "NuxtLink") {
          return true;
        }
        if (c.filePath.includes("@nuxt/content/dist") || c.filePath.includes("nuxt/dist/app") || c.filePath.includes("NuxtWelcome")) {
          return false;
        }
        return true;
      });
    });
    addTemplate({
      filename: "content-components.mjs",
      getContents({ options: options2 }) {
        const components = options2.getComponents(options2.mode).filter((c) => !c.island).flatMap((c) => {
          const exp = c.export === "default" ? "c.default || c" : `c['${c.export}']`;
          const isClient = c.mode === "client";
          const definitions = [];
          definitions.push(`export const ${c.pascalName} = ${genDynamicImport(c.filePath)}.then(c => ${isClient ? `createClientOnly(${exp})` : exp})`);
          return definitions;
        });
        return components.join("\n");
      },
      options: { getComponents: () => componentsContext.components }
    });
    const typesPath = addTemplate({
      filename: "types/content.d.ts",
      getContents: () => [
        "declare module '#content/server' {",
        `  const serverQueryContent: typeof import('${resolve("./runtime/server")}').serverQueryContent`,
        `  const parseContent: typeof import('${resolve("./runtime/server")}').parseContent`,
        "}"
      ].join("\n")
    }).dst;
    nuxt.hook("prepare:types", (options2) => {
      options2.references.push({ path: typesPath });
    });
    const _layers = [...nuxt.options._layers].reverse();
    for (const layer of _layers) {
      const srcDir = layer.config.srcDir;
      const globalComponents = resolve(srcDir, "components/content");
      const dirStat = await fs.promises.stat(globalComponents).catch(() => null);
      if (dirStat && dirStat.isDirectory()) {
        nuxt.hook("components:dirs", (dirs) => {
          dirs.unshift({
            path: globalComponents,
            global: true,
            pathPrefix: false,
            prefix: ""
          });
        });
      }
    }
    if (options.navigation) {
      addImports({ name: "fetchContentNavigation", as: "fetchContentNavigation", from: resolveRuntimeModule("./composables/navigation") });
      nuxt.hook("nitro:config", (nitroConfig) => {
        nitroConfig.handlers = nitroConfig.handlers || [];
        nitroConfig.handlers.push(
          {
            method: "get",
            route: `${options.api.baseURL}/navigation/:qid/**:params`,
            handler: resolveRuntimeModule("./server/api/navigation")
          },
          {
            method: "get",
            route: `${options.api.baseURL}/navigation/:qid`,
            handler: resolveRuntimeModule("./server/api/navigation")
          },
          {
            method: "get",
            route: `${options.api.baseURL}/navigation`,
            handler: resolveRuntimeModule("./server/api/navigation")
          }
        );
      });
    } else {
      addImports({ name: "navigationDisabled", as: "fetchContentNavigation", from: resolveRuntimeModule("./composables/utils") });
    }
    if (options.documentDriven) {
      const defaultDocumentDrivenConfig = {
        page: true,
        navigation: true,
        surround: true,
        globals: {},
        layoutFallbacks: ["theme"],
        injectPage: true
      };
      if (options.documentDriven === true) {
        options.documentDriven = defaultDocumentDrivenConfig;
      } else {
        options.documentDriven = {
          ...defaultDocumentDrivenConfig,
          ...options.documentDriven
        };
      }
      if (options.navigation) {
        options.navigation.fields.push("layout");
      }
      addImports([
        { name: "useContentState", as: "useContentState", from: resolveRuntimeModule("./composables/content") },
        { name: "useContent", as: "useContent", from: resolveRuntimeModule("./composables/content") }
      ]);
      addPlugin(resolveRuntimeModule("./plugins/documentDriven"));
      if (options.documentDriven.injectPage) {
        nuxt.options.pages = true;
        nuxt.hook("pages:extend", (pages) => {
          if (!pages.find((page) => page.path === "/:slug(.*)*")) {
            pages.unshift({
              name: "slug",
              path: "/:slug(.*)*",
              file: resolveRuntimeModule("./pages/document-driven.vue"),
              children: []
            });
          }
        });
        nuxt.hook("app:resolve", async (app) => {
          if (app.mainComponent?.includes("@nuxt/ui-templates")) {
            app.mainComponent = resolveRuntimeModule("./app.vue");
          } else {
            const appContent = await fs.promises.readFile(app.mainComponent, { encoding: "utf-8" });
            if (appContent.includes("<NuxtLayout") || appContent.includes("<nuxt-layout")) {
              logger.warn([
                "Using `<NuxtLayout>` inside `app.vue` will cause unwanted layout shifting in your application.",
                "Consider removing `<NuxtLayout>` from `app.vue` and using it in your pages."
              ].join(""));
            }
          }
        });
      }
    } else {
      addImports([
        { name: "useContentDisabled", as: "useContentState", from: resolveRuntimeModule("./composables/utils") },
        { name: "useContentDisabled", as: "useContent", from: resolveRuntimeModule("./composables/utils") }
      ]);
    }
    await nuxt.callHook("content:context", contentContext);
    contentContext.defaultLocale = contentContext.defaultLocale || contentContext.locales[0];
    const cacheIntegrity = hash({
      locales: options.locales,
      options: options.defaultLocale,
      markdown: options.markdown,
      hightlight: options.highlight
    });
    contentContext.markdown = processMarkdownOptions(contentContext.markdown);
    nuxt.options.runtimeConfig.public.content = defu(nuxt.options.runtimeConfig.public.content, {
      locales: options.locales,
      defaultLocale: contentContext.defaultLocale,
      integrity: buildIntegrity,
      experimental: {
        stripQueryParameters: options.experimental.stripQueryParameters,
        clientDB: options.experimental.clientDB && nuxt.options.ssr === false,
        advancedIgnoresPattern: options.experimental.advancedIgnoresPattern
      },
      api: {
        baseURL: options.api.baseURL
      },
      navigation: contentContext.navigation,
      // Tags will use in markdown renderer for component replacement
      tags: contentContext.markdown.tags,
      highlight: options.highlight,
      wsUrl: "",
      // Document-driven configuration
      documentDriven: options.documentDriven,
      host: typeof options.documentDriven !== "boolean" ? options.documentDriven?.host ?? "" : "",
      trailingSlash: typeof options.documentDriven !== "boolean" ? options.documentDriven?.trailingSlash ?? false : false,
      // Anchor link generation config
      anchorLinks: options.markdown.anchorLinks
    });
    nuxt.options.runtimeConfig.content = defu(nuxt.options.runtimeConfig.content, {
      cacheVersion: CACHE_VERSION,
      cacheIntegrity,
      ...contentContext
    });
    nuxt.hook("tailwindcss:config", (tailwindConfig) => {
      tailwindConfig.content = tailwindConfig.content ?? [];
      tailwindConfig.content.push(resolve(nuxt.options.buildDir, "content-cache", "parsed/**/*.md"));
    });
    const { advancedIgnoresPattern } = contentContext.experimental;
    const isIgnored = makeIgnored(contentContext.ignores, advancedIgnoresPattern);
    if (contentContext.ignores.length && !advancedIgnoresPattern) {
      logger.warn("The `ignores` config is being made more flexible in version 2.7. See the docs for more information: `https://content.nuxtjs.org/api/configuration#ignores`");
    }
    if (!nuxt.options.dev) {
      nuxt.hook("build:before", async () => {
        const storage = createStorage();
        const sources = useContentMounts(nuxt, contentContext.sources);
        sources["cache:content"] = {
          driver: "fs",
          base: resolve(nuxt.options.buildDir, "content-cache")
        };
        for (const [key, source] of Object.entries(sources)) {
          storage.mount(key, getMountDriver(source));
        }
        let keys = await storage.getKeys("content:source");
        const invalidKeyCharacters = `'"?#/`.split("");
        keys = keys.filter((key) => {
          if (key.startsWith("preview:") || isIgnored(key)) {
            return false;
          }
          if (invalidKeyCharacters.some((ik) => key.includes(ik))) {
            return false;
          }
          return true;
        });
        await Promise.all(
          keys.map(async (key) => await storage.setItem(
            `cache:content:parsed:${key.substring(15)}`,
            await storage.getItem(key)
          ))
        );
      });
      return;
    }
    addPlugin(resolveRuntimeModule("./plugins/ws"));
    nuxt.hook("nitro:init", async (nitro) => {
      if (!options.watch || !options.watch.ws) {
        return;
      }
      const ws = createWebSocket();
      const { server, url } = await listen(() => "Nuxt Content", options.watch.ws);
      nitro.hooks.hook("close", async () => {
        await ws.close();
        await server.close();
      });
      server.on("upgrade", ws.serve);
      nitro.options.runtimeConfig.public.content.wsUrl = url.replace("http", "ws");
      await nitro.storage.removeItem("cache:content:content-index.json");
      await nitro.storage.watch(async (event, key) => {
        if (!key.startsWith(MOUNT_PREFIX) || isIgnored(key)) {
          return;
        }
        key = key.substring(MOUNT_PREFIX.length);
        await nitro.storage.removeItem("cache:content:content-index.json");
        ws.broadcast({ event, key });
      });
    });
  }
});

export { module as default };
