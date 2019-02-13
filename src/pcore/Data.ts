// Data must be declared this way to avoid circular reference errors from TypeScript
export interface DataMap { [x: string]: Data; }
export interface DataArray extends Array<Data> {}
export interface StringDataMap extends Map<string,Data> {}
export type Data = null | string | number | boolean | DataMap | StringDataMap | DataArray;
