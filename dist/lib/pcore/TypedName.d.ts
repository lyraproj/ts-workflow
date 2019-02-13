import * as util from 'util';
import { PcoreValue } from './Serializer';
import { StringHash } from './Util';
export declare enum Namespace {
    NsType = "type",
    NsFunction = "function",
    NsInterface = "interface",
    NsDefinition = "definition",
    NsHandler = "handler",
    NsService = "service",
    NsActivity = "activity",
    NsAllocator = "allocator",
    NsConstructor = "constructor"
}
export declare const runtimeAuthority: URL;
export declare class TypedName implements PcoreValue {
    private static readonly allowedCharacters;
    readonly authority: URL;
    readonly namespace: Namespace;
    readonly name: string;
    readonly canonical: any;
    readonly parts: string[];
    constructor(namespace: Namespace, name: string, authority?: URL);
    toString(): string;
    [util.inspect.custom](depth: any, options: any): string;
    __ptype(): string;
    __pvalue(): string | StringHash;
}
