export interface ValueArray extends Array<Value> {
}
export interface ValueMap extends Map<Value, Value> {
}
export interface StringMap extends Map<string, Value> {
}
export interface StringHash {
    [s: string]: Value;
}
export declare type NotNull = string | number | boolean | {} | Uint8Array | ValueMap | ValueArray;
export declare type Value = null | NotNull;
export declare function isHash(value: Value): value is StringHash;
export declare function strictString(value: Value): string | undefined;
export declare function isStringMap(map: Value): map is StringMap;
export declare function makeInt(arg: NotNull): number;
export declare function makeFloat(arg: NotNull): number;
export declare function makeBoolean(arg: NotNull): boolean;
export declare function makeString(arg: Value): string | undefined;
