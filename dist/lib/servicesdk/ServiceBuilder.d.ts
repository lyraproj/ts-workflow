import { Data } from '../pcore/Data';
import { PcoreObject } from '../pcore/Serializer';
import { TypedName } from '../pcore/TypedName';
import { StringHash } from '../pcore/Util';
/**
 * A StateProducer produces a state based on input variables
 */
export declare type StateProducer = Function;
/**
 * A StateProducer produces a state based on input variables
 */
export declare type ActionFunction = Function;
export declare type InParam = {
    type?: string;
    lookup?: Data;
};
export declare type OutParam = {
    type?: string;
    alias?: string;
};
/**
 * The ActivityMap contains the properties common to all Activities
 */
export interface ActivityMap {
    style?: 'action' | 'resource' | 'workflow';
    input?: string | string[] | {
        [s: string]: string | InParam;
    };
    output?: string | string[] | {
        [s: string]: string | OutParam;
    };
    when?: string;
}
export declare function isActivityMap(m: ActivityMap): m is ActivityMap;
/**
 * The ActionMap contains the properties of a workflow action.
 */
export interface ActionMap extends ActivityMap {
    do: ActionFunction;
}
/**
 * The ResourceMap contains the properties of a workflow resource.
 */
export interface ResourceMap extends ActivityMap {
    externalId?: string;
    state: StateProducer;
    type?: string;
}
export interface WorkflowMap extends ActivityMap {
    activities: {
        [s: string]: ActivityMap;
    };
}
export declare function action(a: ActionMap): ActivityMap;
export declare function resource(a: ResourceMap): ActivityMap;
export declare function workflow(a: WorkflowMap): ActivityMap;
export declare class ServiceBuilder {
    readonly serviceId: TypedName;
    readonly definitions: Definition[];
    readonly stateProducers: {
        [s: string]: StateProducer;
    };
    readonly actionFunctions: StringHash;
    constructor(serviceName: string);
    fromMap(n: string, a: ActivityMap, inferred: StringHash): void;
}
export declare class Definition implements PcoreObject {
    readonly identifier: TypedName;
    readonly serviceId: TypedName;
    readonly properties: StringHash;
    constructor(serviceId: TypedName, identifier: TypedName, properties: StringHash);
    toString(): string;
    __ptype(): string;
}
export declare class ActivityBuilder {
    private readonly name;
    private readonly parent;
    private in?;
    private out?;
    private guard?;
    constructor(name: string, parent: ActivityBuilder | null);
    amendWithInferredTypes(inferred: StringHash): void;
    getLeafName(): string;
    getName(): string;
    fromMap(m: ActivityMap): void;
    when(guard: string): void;
    input(params: string | string[] | {
        [s: string]: string | InParam;
    }): void;
    output(params: string | string[] | {
        [s: string]: string | OutParam;
    }): void;
    build(sb: ServiceBuilder, inferred: StringHash): Definition;
    protected qualifyName(n: string): string;
    private convertParams;
    protected definitionProperties(sb: ServiceBuilder, inferred: StringHash): StringHash;
}
export declare class ResourceBuilder extends ActivityBuilder {
    private extId?;
    private typ?;
    private stateProducer?;
    amendWithInferredTypes(inferred: StringHash): void;
    externalId(extId: string): void;
    state(stateProducer: StateProducer): void;
    type(t: string): void;
    build(sb: ServiceBuilder, inferred: StringHash): Definition;
    fromMap(m: ResourceMap): void;
    protected definitionProperties(sb: ServiceBuilder, inferred: StringHash): StringHash;
}
export declare class ActionBuilder extends ActivityBuilder {
    private actionFunction?;
    do(actionFunction: ActionFunction): void;
    build(sb: ServiceBuilder, inferred: StringHash): Definition;
    fromMap(m: ActionMap): void;
}
export declare class WorkflowBuilder extends ActivityBuilder {
    private readonly activities;
    amendWithInferredTypes(inferred: StringHash): void;
    fromMap(m: WorkflowMap): void;
    action(name: string, bf: (rb: ActionBuilder) => void): void;
    resource(name: string, bf: (rb: ResourceBuilder) => void): void;
    workflow(name: string, bf: (rb: WorkflowBuilder) => void): void;
    protected definitionProperties(sb: ServiceBuilder, inferred: StringHash): StringHash;
}
