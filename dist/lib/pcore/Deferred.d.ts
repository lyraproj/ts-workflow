import { PcoreValue } from './Serializer';
import { StringHash, Value } from './Util';
export declare class Deferred implements PcoreValue {
    readonly name: string;
    readonly args: Value[];
    constructor(name: string, ...args: Value[]);
    __ptype(): string;
    __pvalue(): StringHash;
}
