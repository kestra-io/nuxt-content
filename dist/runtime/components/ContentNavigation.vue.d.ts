import type { PropType } from 'vue';
import type { QueryBuilderParams, QueryBuilder } from '../types';
declare const _default: import("vue").DefineComponent<{
    /**
     * A query to be passed to `fetchContentNavigation()`.
     */
    query: {
        type: PropType<QueryBuilderParams | QueryBuilder<import("../types").ParsedContentMeta>>;
        required: false;
        default: undefined;
    };
}, {
    navigation: any;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * A query to be passed to `fetchContentNavigation()`.
     */
    query: {
        type: PropType<QueryBuilderParams | QueryBuilder<import("../types").ParsedContentMeta>>;
        required: false;
        default: undefined;
    };
}>>, {
    query: QueryBuilderParams | QueryBuilder<import("../types").ParsedContentMeta>;
}>;
export default _default;
