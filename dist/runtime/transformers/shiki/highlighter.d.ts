import { Lang, Theme as ShikiTheme } from 'shiki-es';
import type { MarkdownNode, HighlighterOptions, Theme, TokenColorMap } from './types';
export declare const useShikiHighlighter: (opts?: {
    theme?: ShikiTheme | {
        [theme: string]: ShikiTheme;
        default: ShikiTheme;
    } | undefined;
    preload?: Lang[] | undefined;
} | undefined) => {
    getHighlightedTokens: (code: string, lang: Lang, theme: Theme) => Promise<{
        content: string;
    }[][]>;
    getHighlightedAST: (code: string, lang: Lang, theme: Theme, opts?: Partial<HighlighterOptions>) => Promise<Array<MarkdownNode>>;
    getHighlightedCode: (code: string, lang: Lang, theme: Theme, opts?: Partial<HighlighterOptions>) => Promise<{
        code: string;
        styles: string;
    }>;
    generateStyles: (colorMap: TokenColorMap) => string;
};
