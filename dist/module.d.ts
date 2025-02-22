import * as _nuxt_schema from '@nuxt/schema';
import { ListenOptions } from 'listhen';
import { Theme, Lang } from 'shiki-es';

interface ParsedContentInternalMeta {
  /**
   * Content id
   */
  _id: string
  /**
   * Content source
   */
  _source?: string
  /**
   * Content path, this path is source agnostic and it the content my live in any source
   */
  _path?: string
  /**
   * Content title
   */
  title?: string
  /**
   * Content draft status
   */
  _draft?: boolean
  /**
   * Content partial status
   */
  _partial?: boolean
  /**
   * Content locale
   */
  _locale?: string
  /**
   * File type of the content, i.e `markdown`
   */
  _type?: string
  /**
   * Path to the file relative to the content directory
   */
  _file?: string
  /**
   * Extension of the file
   */
  _extension?: string
}

interface MarkdownPlugin extends Record<string, any> {}

/**
 * Query
 */
interface SortParams {
  /**
   * Locale specifier for sorting
   * A string with a BCP 47 language tag
   *
   * @default undefined
   */
  $locale?: string
  /**
   * Whether numeric collation should be used, such that "1" < "2" < "10".
   * Possible values are `true` and `false`;
   *
   * @default false
   */
  $numeric?: boolean
  /**
   * Whether upper case or lower case should sort first.
   * Possible values are `"upper"`, `"lower"`, or `"false"`
   *
   * @default "depends on locale"
   */
  $caseFirst?: 'upper' | 'lower' | 'false'
  /**
   * Which differences in the strings should lead to non-zero result values. Possible values are:
   *  - "base": Only strings that differ in base letters compare as unequal. Examples: a ≠ b, a = á, a = A.
   *  - "accent": Only strings that differ in base letters or accents and other diacritic marks compare as unequal. Examples: a ≠ b, a ≠ á, a = A.
   *  - "case": Only strings that differ in base letters or case compare as unequal. Examples: a ≠ b, a = á, a ≠ A.
   *  - "variant": Strings that differ in base letters, accents and other diacritic marks, or case compare as unequal. Other differences may also be taken into consideration. Examples: a ≠ b, a ≠ á, a ≠ A.
   *
   * @default "variant"
   */
  $sensitivity?: 'base' | 'accent' | 'case' | 'variant'
}

interface SortFields {
  [field: string]: -1 | 1
}

type SortOptions = SortParams | SortFields

interface QueryBuilderWhere extends Partial<Record<keyof ParsedContentInternalMeta, string | number | boolean | RegExp | QueryBuilderWhere>> {
  /**
   * Match only if all of nested conditions are true
   *
   * @example
    ```ts
    queryContent().where({
      $and: [
        { score: { $gte: 5 } },
        { score: { $lte: 10 } }
      ]
    })
    ```
   **/
  $and?: QueryBuilderWhere[]
  /**
   * Match if any of nested conditions is true
   *
   * @example
    ```ts
    queryContent().where({
      $or: [
        { score: { $gt: 5 } },
        { score: { $lt: 3 } }
      ]
    })
    ```
   **/
  $or?: QueryBuilderWhere[]
  /**
   * Match is condition is false
   *
   * @example
    ```ts
    queryContent().where({
      title: {
        $not: 'Hello World'
      }
    })
    ```
   **/
  $not?: string | number | boolean | RegExp | QueryBuilderWhere
  /**
   * Match if item equals condition
   *
   * @example
    ```ts
    queryContent().where({
      title: {
        $eq: 'Hello World'
      }
    })
    ```
   **/
  $eq?: string | number | boolean | RegExp
  /**
   * Match if item not equals condition
   *
   * @example
    ```ts
    queryContent().where({
      score: {
        $ne: 100
      }
    })
    ```
   **/
  $ne?: string | number | boolean | RegExp
  /**
   * Check if item is greater than condition
   *
   * @example
    ```ts
    queryContent().where({
      score: {
        $gt: 99.5
      }
    })
    ```
   */
  $gt?: number
  /**
   * Check if item is greater than or equal to condition
   *
   * @example
    ```ts
    queryContent().where({
      score: {
        $gte: 99.5
      }
    })
    ```
   */
  $gte?: number
  /**
   * Check if item is less than condition
   *
   * @example
    ```ts
    queryContent().where({
      score: {
        $lt: 99.5
      }
    })
    ```
   */
  $lt?: number
  /**
   * Check if item is less than or equal to condition
   *
   * @example
    ```ts
    queryContent().where({
      score: {
        $lte: 99.5
      }
    })
    ```
   */
  $lte?: number
  /**
   * Provides regular expression capabilities for pattern matching strings.
   *
   * @example
    ```ts
    queryContent().where({
      title: {
        $regex: /^foo/
      }
    })
    ```
   */
  $regex?: RegExp | string
  /**
   * Match if type of item equals condition
   *
   * @example
    ```ts
    queryContent().where({
      field: {
        $type: 'boolean'
      }
    })
    ```
   */
  $type?: string
  /**
   * Check key existence
   *
   * @example
    ```ts
    queryContent().where({
      tag: {
        $exists: false
      }
    })
    ```
   */
  $exists?: boolean
  /**
   * Match if item contains every condition or math every rule in condition array
   *
   * @example
    ```ts
    queryContent().where({
      title: {
        $contains: ['Hello', 'World']
      }
    })
    ```
   **/
  $contains?: Array<string | number | boolean> | string | number | boolean
  /**
   * Match if item contains at least one rule from condition array
   *
   * @example
    ```ts
    queryContent().where({
      title: {
        $containsAny: ['Hello', 'World']
      }
    })
    ```
   */
  $containsAny?: Array<string | number | boolean>
  /**
   * Ignore case contains
   *
   * @example
    ```ts
    queryContent().where({
      title: {
        $icontains: 'hello world'
      }
    })
    ```
   **/
  $icontains?: string
  /**
   * Match if item is in condition array
   *
   * @example
    ```ts
    queryContent().where({
      category: {
        $in: ['sport', 'nature', 'travel']
      }
    })
    ```
   **/
  $in?: Array<string | number | boolean>

  [key: string]: string | number | boolean | RegExp | QueryBuilderWhere | Array<string | number | boolean | QueryBuilderWhere>
}

interface QueryBuilderParams {
  first?: boolean
  skip?: number
  limit?: number
  only?: string[]
  without?: string[]
  sort?: SortOptions[]
  where?: QueryBuilderWhere[]
  surround?: {
    query: string | QueryBuilderWhere
    before?: number
    after?: number
  }

  [key: string]: any
}

type MountOptions = {
    driver: 'fs' | 'http' | string;
    name?: string;
    prefix?: string;
    [options: string]: any;
};
interface ModuleOptions {
    /**
     * Base route that will be used for content api
     *
     * @default '_content'
     * @deprecated Use `api.base` instead
     */
    base: string;
    api: {
        /**
         * Base route that will be used for content api
         *
         * @default '/api/_content'
         */
        baseURL: string;
    };
    /**
     * Disable content watcher and hot content reload.
     * Note: Watcher is a development feature and will not includes in the production.
     *
     * @default true
     */
    watch: false | {
        ws: Partial<ListenOptions>;
    };
    /**
     * Contents can be located in multiple places, in multiple directories or even in remote git repositories.
     * Using sources option you can tell Content module where to look for contents.
     *
     * @default ['content']
     */
    sources: Record<string, MountOptions> | Array<string | MountOptions>;
    /**
     * List of ignore patterns that will be used to exclude content from parsing, rendering and watching.
     *
     * Note that files with a leading . or - are ignored by default
     *
     * @default []
     */
    ignores: Array<string>;
    /**
     * Content module uses `remark` and `rehype` under the hood to compile markdown files.
     * You can modify this options to control its behavior.
     */
    markdown: {
        /**
         * Whether MDC syntax should be supported or not.
         *
         * @default true
         */
        mdc?: boolean;
        /**
         * Control behavior of Table of Contents generation
         */
        toc?: {
            /**
             * Maximum heading depth that includes in the table of contents.
             *
             * @default 2
             */
            depth?: number;
            /**
             * Maximum depth of nested tags to search for heading.
             *
             * @default 2
             */
            searchDepth?: number;
        };
        /**
         * Tags will be used to replace markdown components and render custom components instead of default ones.
         *
         * @default {}
         */
        tags?: Record<string, string>;
        /**
         * Register custom remark plugin to provide new feature into your markdown contents.
         * Checkout: https://github.com/remarkjs/remark/blob/main/doc/plugins.md
         *
         * @default []
         */
        remarkPlugins?: Array<string | [string, MarkdownPlugin]> | Record<string, false | MarkdownPlugin>;
        /**
         * Register custom remark plugin to provide new feature into your markdown contents.
         * Checkout: https://github.com/rehypejs/rehype/blob/main/doc/plugins.md
         *
         * @default []
         */
        rehypePlugins?: Array<string | [string, MarkdownPlugin]> | Record<string, false | MarkdownPlugin>;
        /**
         * Anchor link generation config
         *
         * @default {}
         */
        anchorLinks?: boolean | {
            /**
              * Sets the maximal depth for anchor link generation
              *
              * @default 4
              */
            depth?: number;
            /**
             * Excludes headings from link generation when they are in the depth range.
             *
             * @default [1]
             */
            exclude?: number[];
        };
    };
    /**
     * Content module uses `shiki` to highlight code blocks.
     * You can configure Shiki options to control its behavior.
     */
    highlight: false | {
        /**
         * Default theme that will be used for highlighting code blocks.
         */
        theme?: Theme | {
            default: Theme;
            [theme: string]: Theme;
        };
        /**
         * Preloaded languages that will be available for highlighting code blocks.
         */
        preload?: Lang[];
    };
    /**
     * Options for yaml parser.
     *
     * @default {}
     */
    yaml: false | Record<string, any>;
    /**
     * Options for yaml parser.
     *
     * @default {}
     */
    csv: false | {
        json?: boolean;
        delimeter?: string;
    };
    /**
     * Enable/Disable navigation.
     *
     * @default {}
     */
    navigation: false | {
        fields: Array<string>;
    };
    /**
     * List of locale codes.
     * This codes will be used to detect contents locale.
     *
     * @default []
     */
    locales: Array<string>;
    /**
     * Default locale for top level contents.
     *
     * @default undefined
     */
    defaultLocale?: string;
    /**
     * Document-driven mode config
     *
     * @default false
     */
    documentDriven: boolean | {
        host?: string;
        page?: boolean;
        navigation?: boolean;
        surround?: boolean;
        globals?: {
            [key: string]: QueryBuilderParams;
        };
        layoutFallbacks?: string[];
        injectPage?: boolean;
        trailingSlash?: boolean;
    };
    experimental: {
        clientDB: boolean;
        stripQueryParameters: boolean;
        advancedIgnoresPattern: boolean;
    };
}
interface ContentContext extends ModuleOptions {
    base: Readonly<string>;
    transformers: Array<string>;
}
interface ModuleHooks {
    'content:context'(ctx: ContentContext): void;
}
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions>;

interface ModulePublicRuntimeConfig {
    experimental: {
        stripQueryParameters: boolean;
        clientDB: boolean;
        advancedIgnoresPattern: boolean;
    };
    defaultLocale: ModuleOptions['defaultLocale'];
    locales: ModuleOptions['locales'];
    tags: Record<string, string>;
    base: string;
    wsUrl?: string;
    highlight: ModuleOptions['highlight'];
    navigation: ModuleOptions['navigation'];
    documentDriven: ModuleOptions['documentDriven'];
}
interface ModulePrivateRuntimeConfig {
    /**
     * Internal version that represents cache format.
     * This is used to invalidate cache when the format changes.
     */
    cacheVersion: string;
    cacheIntegrity: string;
}
declare module '@nuxt/schema' {
    interface ConfigSchema {
        runtimeConfig: {
            public?: {
                content?: ModulePublicRuntimeConfig;
            };
            private?: {
                content?: ModulePrivateRuntimeConfig & ContentContext;
            };
        };
    }
}

export { ModuleHooks, ModuleOptions, MountOptions, _default as default };
