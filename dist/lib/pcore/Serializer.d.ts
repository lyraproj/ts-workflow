import { Context } from './Context';
import { StringHash, Value } from './Util';
export declare const PTYPE_KEY = "__ptype";
export declare const PVALUE_KEY = "__pvalue";
export interface PcoreObject {
    __ptype(): string;
}
export interface PcoreValue extends PcoreObject {
    __pvalue(): string | number | StringHash;
}
export declare function isPcoreObject(value: object): value is PcoreObject;
export declare function isPcoreValue(value: object): value is PcoreValue;
export declare const DEFAULT: unique symbol;
declare const enum DedupLevel {
    NoDedup = 0,
    NoKeyDedup = 1,
    MaxDedup = 2
}
export interface ValueConsumer {
    canDoBinary(): boolean;
    canDoComplexKeys(): boolean;
    add(value: boolean | number | string | Uint8Array | null): any;
    addArray(len: number, doer: () => void): any;
    addHash(len: number, doer: () => void): any;
    addRef(ref: number): any;
    stringDedupThreshold(): number;
}
export declare class Serializer {
    readonly context: Context;
    readonly richData: boolean;
    readonly dedupLevel: DedupLevel;
    constructor(c: Context, options: {
        rich_data?: boolean;
        dedup_level?: DedupLevel;
    });
    convert(value: Value, consumer: ValueConsumer): void;
}
export {};
