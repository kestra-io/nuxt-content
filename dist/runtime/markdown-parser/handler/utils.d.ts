/**
 * Parses the value defined next to 3 back ticks
 * in a codeblock and set line-highlights or
 * filename from it
 */
export declare function parseThematicBlock(lang: string): {
    language: undefined;
    highlights: undefined;
    fileName: undefined;
    filename?: undefined;
} | {
    language: string | undefined;
    highlights: number[] | undefined;
    filename: string | undefined;
    fileName?: undefined;
};
export declare function getTagName(value: string): string | null;
/**
 * Wrap `nodes` with line feeds between each entry.
 * Optionally adds line feeds at the start and end.
 */
export declare function wrap(nodes: any[], loose?: boolean): never[];
