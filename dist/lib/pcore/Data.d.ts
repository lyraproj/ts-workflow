export interface DataMap {
    [x: string]: Data;
}
export interface DataArray extends Array<Data> {
}
export interface StringDataMap extends Map<string, Data> {
}
export declare type Data = null | string | number | boolean | DataMap | StringDataMap | DataArray;
