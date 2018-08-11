import * as datapb from "./data_pb";

export function fromDataHash(dataHash: datapb.DataHash): { [s: string]: any } {
  let hash: {[s: string]: any } = {};
  dataHash.getEntriesList().forEach(function (entry: datapb.DataEntry) {
    hash[entry.getKey()] = fromData(entry.getValue());
  });
  return hash;
}

export function fromData(data: datapb.Data): any {
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
    return data.getArrayValue().getValuesList().map(fromData);
  case datapb.Data.KindCase.HASH_VALUE:
    return fromDataHash(data.getHashValue());
  }
  return null;
}

export function toDataHash(value: { [s: string]: any }): datapb.DataHash {
  let entries: Array<datapb.DataEntry> = [];
  for (let key in value) {
    if (value.hasOwnProperty(key)) {
      let entry = new datapb.DataEntry();
      entry.setKey(key);
      entry.setValue(toData(value[key]));
      entries.push(entry);
    }
  }
  let dh = new datapb.DataHash();
  dh.setEntriesList(entries);
  return dh;
}

export function toData(value: any): datapb.Data {
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
      d.setUndefValue(null);
    } else {
      switch (value.constructor) {
      case Array:
        let a = new datapb.DataArray();
        a.setValuesList((<Array<any>>value).map(toData));
        d.setArrayValue(a);
        break;
      case String:
      case Number:
      case Boolean:
        d = toData(value.valueOf());
        break;
      case undefined:
        d.setUndefValue(null);
        break;
      default:
        d.setHashValue(toDataHash(<{}>value));
      }
    }
    break;
  case 'symbol':
    d.setStringValue(value);
    break;
  default:
    d.setUndefValue(value);
  }
  return d;
}
