import { Data } from '../../generated/datapb/data_pb';
import { ValueConsumer } from './Serializer';
export declare class ProtoConsumer implements ValueConsumer {
    private readonly stack;
    constructor();
    add(value: boolean | number | string | Uint8Array | null): void;
    addArray(len: number, doer: () => void): void;
    addHash(len: number, doer: () => void): void;
    addRef(ref: number): void;
    canDoComplexKeys(): boolean;
    canDoBinary(): boolean;
    stringDedupThreshold(): number;
    value(): Data;
    private addData;
}
export declare function consumePBData(data: Data, consumer: ValueConsumer): void;
