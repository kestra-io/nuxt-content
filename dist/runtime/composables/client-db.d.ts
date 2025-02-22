import type { Storage } from 'unstorage';
import type { NavItem, ParsedContent, QueryBuilderParams } from '../types';
export declare const contentStorage: Storage;
export declare function createDB(storage: Storage): {
    storage: Storage;
    fetch: (query: import("../types").QueryBuilder<ParsedContent>) => Promise<ParsedContent | ParsedContent[]>;
    query: (query?: QueryBuilderParams) => import("../types").QueryBuilder<ParsedContent>;
};
export declare function useContentDatabase(): Promise<{
    storage: Storage;
    fetch: (query: import("../types").QueryBuilder<ParsedContent>) => Promise<ParsedContent | ParsedContent[]>;
    query: (query?: QueryBuilderParams | undefined) => import("../types").QueryBuilder<ParsedContent>;
}>;
export declare function generateNavigation(query?: QueryBuilderParams): Promise<Array<NavItem>>;
