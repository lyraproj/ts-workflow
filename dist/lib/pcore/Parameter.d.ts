import * as util from 'util';
import { PcoreValue } from './Serializer';
import { Type } from './Type';
import { StringHash, Value } from './Util';
export declare class Parameter implements PcoreValue {
    readonly name: string;
    readonly type: Type;
    readonly value?: Value;
    readonly captures?: boolean;
    constructor(name: string, type?: string | Type, value?: Value, captures?: boolean);
    [util.inspect.custom](depth: any, options: any): string;
    __ptype(): string;
    __pvalue(): StringHash;
}
