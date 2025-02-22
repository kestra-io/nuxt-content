declare const _default: import("vue").DefineComponent<{
    /**
     * Content to render
     */
    value: {
        type: ObjectConstructor;
        required: true;
    };
    /**
     * Render only the excerpt
     */
    excerpt: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Root tag to use for rendering
     */
    tag: {
        type: StringConstructor;
        default: string;
    };
    /**
     * The map of custom components to use for rendering.
     */
    components: {
        type: ObjectConstructor;
        default: () => {};
    };
}, {
    debug: any;
    tags: any;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Content to render
     */
    value: {
        type: ObjectConstructor;
        required: true;
    };
    /**
     * Render only the excerpt
     */
    excerpt: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Root tag to use for rendering
     */
    tag: {
        type: StringConstructor;
        default: string;
    };
    /**
     * The map of custom components to use for rendering.
     */
    components: {
        type: ObjectConstructor;
        default: () => {};
    };
}>>, {
    components: Record<string, any>;
    tag: string;
    excerpt: boolean;
}>;
export default _default;
