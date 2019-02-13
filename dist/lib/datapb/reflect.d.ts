import { Data } from '../pcore/Data';
import * as datapb from './data_pb';
export declare function fromData(data: datapb.Data): Data;
export declare function toDataHash(value: {
    [s: string]: Data;
}): datapb.DataHash;
export declare function toData(value: Data): datapb.Data;
