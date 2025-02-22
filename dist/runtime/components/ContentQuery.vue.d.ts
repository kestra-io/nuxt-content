import { PropType } from 'vue';
import type { SortParams } from '../types';
declare const _default: import("vue").DefineComponent<{
    /**
     * The path of the content to load from content source.
     */
    path: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Select a subset of fields
     */
    only: {
        type: PropType<string[]>;
        required: false;
        default: undefined;
    };
    /**
     * Remove a subset of fields
     */
    without: {
        type: PropType<string[]>;
        required: false;
        default: undefined;
    };
    /**
     * Filter results
     */
    where: {
        type: PropType<{
            [key: string]: any;
        }>;
        required: false;
        default: undefined;
    };
    /**
     * Sort results
     */
    sort: {
        type: PropType<SortParams>;
        required: false;
        default: undefined;
    };
    /**
     * Limit number of results
     */
    limit: {
        type: PropType<number>;
        required: false;
        default: undefined;
    };
    /**
     * Skip number of results
     */
    skip: {
        type: PropType<number>;
        required: false;
        default: undefined;
    };
    /**
     * Filter contents based on locale
     */
    locale: {
        type: PropType<string>;
        required: false;
        default: undefined;
    };
    /**
     * A type of query to be made.
     */
    find: {
        type: PropType<"one" | "surround">;
        required: false;
        default: undefined;
    };
}, {
    isPartial: any;
    data: any;
    refresh: any;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * The path of the content to load from content source.
     */
    path: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * Select a subset of fields
     */
    only: {
        type: PropType<string[]>;
        required: false;
        default: undefined;
    };
    /**
     * Remove a subset of fields
     */
    without: {
        type: PropType<string[]>;
        required: false;
        default: undefined;
    };
    /**
     * Filter results
     */
    where: {
        type: PropType<{
            [key: string]: any;
        }>;
        required: false;
        default: undefined;
    };
    /**
     * Sort results
     */
    sort: {
        type: PropType<SortParams>;
        required: false;
        default: undefined;
    };
    /**
     * Limit number of results
     */
    limit: {
        type: PropType<number>;
        required: false;
        default: undefined;
    };
    /**
     * Skip number of results
     */
    skip: {
        type: PropType<number>;
        required: false;
        default: undefined;
    };
    /**
     * Filter contents based on locale
     */
    locale: {
        type: PropType<string>;
        required: false;
        default: undefined;
    };
    /**
     * A type of query to be made.
     */
    find: {
        type: PropType<"one" | "surround">;
        required: false;
        default: undefined;
    };
}>>, {
    sort: SortParams;
    find: "one" | "surround";
    path: string;
    only: string[];
    without: string[];
    where: {
        [key: string]: any;
    };
    limit: number;
    skip: number;
    locale: string;
}>;
export default _default;
