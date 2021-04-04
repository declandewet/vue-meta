import { App, ComponentInternalInstance, Slots, VNode } from 'vue';
import { SSRContext } from '@vue/server-renderer';

declare const IS_PROXY: unique symbol;
declare const PROXY_SOURCES: unique symbol;
declare const PROXY_TARGET: unique symbol;
declare const RESOLVE_CONTEXT: unique symbol;

interface ResolveContext {
}
declare type MergeSource<T extends Object> = {
    [K in keyof T]: T[K];
} & {
    [IS_PROXY]: boolean;
    [PROXY_SOURCES]: MergeSource<T>[];
    [PROXY_TARGET]: MergeSource<T>;
    [RESOLVE_CONTEXT]: ResolveContext;
};
declare type MergedObjectValue = boolean | number | string | MergedObject | any;
declare type MergedObject = {
    [key: string]: MergedObjectValue;
};
declare type PathSegments = Array<string>;
interface ResolveMethod<T = any, U = ResolveContext> {
    (options: Array<T>, contexts: Array<U>, active: MergedObjectValue, key: string | number | symbol, pathSegments: PathSegments): MergedObjectValue;
}
declare type MergeContext<T> = {
    resolve: ResolveMethod;
    active: MergedObject;
    sources: MergeSource<T>[];
};
declare type MergedObjectBuilder<T> = {
    context: MergeContext<T>;
    compute: () => void;
    addSource: (source: T, resolveContext?: ResolveContext, recompute?: Boolean) => any;
    delSource: (sourceOrProxy: T | MergeSource<T>, recompute?: boolean) => boolean;
};

declare type createMetaManagerMethod = (config: MetaConfig, resolver: MetaResolver | ResolveMethod) => MetaManager;
declare const createMetaManager: (config?: MetaConfig | undefined, resolver?: MetaResolver | undefined) => MetaManager;
declare class MetaManager {
    config: MetaConfig;
    target: MergedObjectBuilder<MetaSource>;
    resolver?: MetaResolverSetup;
    ssrCleanedUp: boolean;
    constructor(config: MetaConfig, target: MergedObjectBuilder<MetaSource>, resolver: MetaResolver | ResolveMethod);
    static create: createMetaManagerMethod;
    install(app: App): void;
    addMeta(metadata: MetaSource, vm?: ComponentInternalInstance): MetaProxy;
    private unmount;
    private reallyUnmount;
    render({ slots }?: {
        slots?: Slots;
    }): VNode[];
}

declare type MetaConfigSectionKey = 'tag' | 'to' | 'keyAttribute' | 'valueAttribute' | 'nameless' | 'group' | 'namespaced' | 'namespacedAttribute' | 'attributesFor';
interface MetaConfigSectionTag {
    tag?: string;
    to?: string;
    keyAttribute?: string;
    valueAttribute?: string;
    nameless?: boolean;
}
declare type MetaConfigSectionGroup = {
    group: boolean;
    namespaced?: boolean;
    namespacedAttribute?: boolean;
};
declare type MetaConfigSectionAttribute = {
    attributesFor: string;
};
declare type MetaConfigSection = MetaConfigSectionGroup | MetaConfigSectionTag | MetaConfigSectionAttribute;
interface MetaConfig {
    [key: string]: MetaConfigSection;
}
declare type MetaTagConfigKey = 'keyAttribute' | 'contentAsAttribute' | 'attributes';
interface MetaTagConfig {
    keyAttribute?: string;
    contentAsAttribute?: boolean | string;
    attributes: boolean | Array<string>;
}
declare type MetaTagName = 'title' | 'base' | 'meta' | 'link' | 'style' | 'script' | 'noscript';
declare type MetaTagsConfig = {
    [key in MetaTagName]: MetaTagConfig;
};

declare type Modify<T, R> = Omit<T, keyof R> & R;
declare type TODO = any;
/**
 * Proxied meta source for tracking changes and updating the active meta daa
 */
interface MetaSourceProxy extends MergedObject {
}
/**
 * Metainfo data source input by the user through the useMeta fn
 */
declare type MetaSource = {
    [key: string]: TODO;
};
declare type MetaGuardRemoved = () => void | Promise<void>;
/**
 * Return value of the useMeta api
 */
declare type MetaProxy = {
    meta: MetaSourceProxy;
    onRemoved: (removeGuard: MetaGuardRemoved) => void;
    unmount: (ignoreGuards?: boolean) => void;
};
/**
 * The active/aggregated meta data currently rendered
 */
interface MetaActive {
    [key: string]: TODO;
}
/**
 * Context passed to the meta resolvers
 */
declare type MetaResolveContext = ResolveContext & {
    vm: ComponentInternalInstance | undefined;
};
declare type MetaResolveSetup = (context: MetaResolveContext) => void;
declare type MetaResolver = {
    setup?: MetaResolveSetup;
    resolve: ResolveMethod;
};
declare type MetaResolverSetup = Modify<MetaResolver, {
    setup: MetaResolveSetup;
}>;
/**
 * @internal
 */
declare type MetaTeleports = {
    [key: string]: Array<VNode>;
};
/**
 * @internal
 */
interface MetaGuards {
    removed: Array<MetaGuardRemoved>;
}
/**
 * @internal
 */
interface MetaRenderContext {
    slots?: Slots;
    metainfo: MetaActive;
}
/**
 * @internal
 */
interface MetaGroupConfig {
    group: string;
    data: Array<TODO> | TODO;
    tagNamespace?: string;
    fullName?: string;
    slotName?: string;
}
/**
 * @internal
 */
interface SlotScopeProperties {
    content: string;
    metainfo: MetaActive;
    [key: string]: any;
}
/**
 * @internal
 */
declare type MetaRenderedNode = {
    vnode: VNode;
    to?: string;
};
/**
 * @internal
 */
declare type MetaRendered = Array<MetaRenderedNode>;
declare module '@vue/runtime-core' {
    interface ComponentInternalInstance {
        $metaManager: MetaManager;
        $metaGuards: MetaGuards;
    }
}

declare type MergeResolveContextDeepest = MetaResolveContext & {
    depth: number;
};
declare function setup(context: MergeResolveContextDeepest): void;
declare const resolve: ResolveMethod<any, MergeResolveContextDeepest>;

declare const deepest_d_setup: typeof setup;
declare const deepest_d_resolve: typeof resolve;
declare namespace deepest_d {
  export {
    deepest_d_setup as setup,
    deepest_d_resolve as resolve,
  };
}

declare const defaultConfig: MetaConfig;

interface ResolveOptionPredicament<T, U> {
    (currentValue: T | undefined, context: U): T;
}
declare const resolveOption: <T, U = ResolveContext>(predicament: ResolveOptionPredicament<T, U>, initialValue?: T | undefined) => ResolveMethod<any, U>;

declare function renderToStringWithMeta(app: App): Promise<[string, SSRContext]>;

declare function getCurrentManager(vm?: ComponentInternalInstance): MetaManager | undefined;
declare function useMeta(source: MetaSource, manager?: MetaManager): MetaProxy;
declare function useActiveMeta(): MetaActive;

export { MetaActive, MetaConfig, MetaConfigSection, MetaConfigSectionAttribute, MetaConfigSectionGroup, MetaConfigSectionKey, MetaConfigSectionTag, MetaGroupConfig, MetaGuardRemoved, MetaGuards, MetaProxy, MetaRenderContext, MetaRendered, MetaRenderedNode, MetaResolveContext, MetaResolveSetup, MetaResolver, MetaResolverSetup, MetaSource, MetaSourceProxy, MetaTagConfig, MetaTagConfigKey, MetaTagName, MetaTagsConfig, MetaTeleports, Modify, SlotScopeProperties, TODO, createMetaManager, deepest_d as deepestResolver, defaultConfig, getCurrentManager, renderToStringWithMeta, resolveOption, useActiveMeta, useMeta };
