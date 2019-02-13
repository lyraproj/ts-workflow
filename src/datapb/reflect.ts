import {Data} from '../pcore/Data';

import * as datapb from './data_pb';
import {NullValue} from './data_pb';

export function fromData(data: datapb.Data): Data {
  switch (data.getKindCase().valueOf()) {
    case datapb.Data.KindCase.BOOLEAN_VALUE:
      return data.getBooleanValue();
    case datapb.Data.KindCase.INTEGER_VALUE:
      return data.getIntegerValue();
    case datapb.Data.KindCase.FLOAT_VALUE:
      return data.getFloatValue();
    case datapb.Data.KindCase.STRING_VALUE:
      return data.getStringValue();
    case datapb.Data.KindCase.ARRAY_VALUE:
      // @ts-ignore
      return data.getArrayValue().getValuesList().map(fromData);
    case datapb.Data.KindCase.HASH_VALUE:
      const hash: {[s: string]: Data} = {};
      // @ts-ignore
      data.getHashValue().getEntriesList().forEach((entry: datapb.DataEntry) => {
        // @ts-ignore
        hash[fromData(entry.getKey())] = fromData(entry.getValue());
      });
      return hash;
  }
  return null;
}

export function toDataHash(value: {[s: string]: Data}): datapb.DataHash {
  const entries: datapb.DataEntry[] = [];
  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      const entry = new datapb.DataEntry();
      entry.setKey(toData(key));
      entry.setValue(toData(value[key]));
      entries.push(entry);
    }
  }
  const dh = new datapb.DataHash();
  dh.setEntriesList(entries);
  return dh;
}

export function toData(value: Data): datapb.Data {
  let d = new datapb.Data();

  switch (typeof value) {
    case 'number':
      value % 1 === 0 ? d.setIntegerValue(value) : d.setFloatValue(value);
      break;
    case 'boolean':
      d.setBooleanValue(value);
      break;
    case 'string':
      d.setStringValue(value);
      break;
    case 'object':
      if (value === null) {
        d.setUndefValue(NullValue.NULL_VALUE);
      } else {
        switch (value.constructor) {
          case Array:
            const a = new datapb.DataArray();
            a.setValuesList((value as Data[]).map(toData));
            d.setArrayValue(a);
            break;
          case String:
          case Number:
          case Boolean:
            d = toData(value.valueOf() as string | number | boolean);
            break;
          case undefined:
            d.setUndefValue(NullValue.NULL_VALUE);
            break;
          default:
            d.setHashValue(toDataHash(value as {}));
        }
      }
      break;
    default:
      d.setUndefValue(value);
  }
  return d;
}
