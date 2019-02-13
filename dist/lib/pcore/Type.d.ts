import * as util from 'util';
import { PcoreValue } from './Serializer';
export declare class Type implements PcoreValue {
    readonly typeString: string;
    constructor(typeString: string);
    [util.inspect.custom](depth: any, options: any): string;
    __ptype(): string;
    __pvalue(): string;
}
export declare const anyType: Type;
