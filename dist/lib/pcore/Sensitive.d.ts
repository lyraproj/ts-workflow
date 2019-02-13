import { Value } from './Util';
export declare class Sensitive {
    private readonly value;
    constructor(value: Value);
    toString(): string;
    unwrap(): Value;
}
