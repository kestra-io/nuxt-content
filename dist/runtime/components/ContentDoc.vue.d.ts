import { PropType } from 'vue';
import type { QueryBuilderParams } from '../types';
declare const _default: import("vue").DefineComponent<{
    /**
     * Renderer props
     */
    /**
     * The tag to use for the renderer element if it is used.
     * @default 'div'
     */
    tag: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Whether or not to render the excerpt.
     * @default false
     */
    excerpt: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Query props
     */
    /**
     * The path of the content to load from content source.
     * @default useRoute().path
     */
    path: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * A query builder params object to be passed to <ContentQuery /> component.
     */
    query: {
        type: PropType<QueryBuilderParams>;
        required: false;
        default: undefined;
    };
    /**
     * Whether or not to map the document data to the `head` property.
     */
    head: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}, unknown, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Renderer props
     */
    /**
     * The tag to use for the renderer element if it is used.
     * @default 'div'
     */
    tag: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Whether or not to render the excerpt.
     * @default false
     */
    excerpt: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Query props
     */
    /**
     * The path of the content to load from content source.
     * @default useRoute().path
     */
    path: {
        type: StringConstructor;
        required: false;
        default: undefined;
    };
    /**
     * A query builder params object to be passed to <ContentQuery /> component.
     */
    query: {
        type: PropType<QueryBuilderParams>;
        required: false;
        default: undefined;
    };
    /**
     * Whether or not to map the document data to the `head` property.
     */
    head: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}>>, {
    tag: string;
    excerpt: boolean;
    path: string;
    query: QueryBuilderParams;
    head: boolean;
}>;
export default _default;
