import { PropType } from 'vue';
import type { QueryBuilderParams } from '../types';
declare const _default: import("vue").DefineComponent<{
    /**
     * Query props
     */
    /**
     * The path of the content to load from content source.
     * @default '/'
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
}, unknown, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Query props
     */
    /**
     * The path of the content to load from content source.
     * @default '/'
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
}>>, {
    path: string;
    query: QueryBuilderParams;
}>;
export default _default;
