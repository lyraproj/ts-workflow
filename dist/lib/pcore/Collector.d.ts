import { ValueConsumer } from './Serializer';
import { Value } from './Util';
export interface Collector extends ValueConsumer {
    value(): Value;
}
export declare class MemCollector implements Collector {
    private readonly values;
    private readonly stack;
    constructor();
    add(value: boolean | number | string | Uint8Array | null): void;
    addArray(len: number, doer: () => void): void;
    addHash(len: number, doer: () => void): void;
    addRef(ref: number): void;
    canDoComplexKeys(): boolean;
    canDoBinary(): boolean;
    stringDedupThreshold(): number;
    value(): Value;
    private addAny;
}
