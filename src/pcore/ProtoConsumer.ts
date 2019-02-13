import {types} from 'util';

import {Data, DataArray, DataEntry, DataHash, NullValue} from '../../generated/datapb/data_pb';

import {ValueConsumer} from './Serializer';

export class ProtoConsumer implements ValueConsumer {
  private readonly stack: Data[][];

  constructor() {
    this.stack = new Array<Data[]>();
    this.stack.push(new Array<Data>());
  }

  add(value: boolean|number|string|Uint8Array|null) {
    const d = new Data();

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
      default:
        if (types.isUint8Array(value)) {
          d.setBinaryValue(value);
        } else {
          d.setUndefValue(NullValue.NULL_VALUE);
        }
    }
    this.addData(d);
  }

  addArray(len: number, doer: () => void) {
    this.stack.push(new Array<Data>());
    doer();
    const els = this.stack.pop();
    if (els === undefined) {
      throw new Error('Array function caused data consumer unbalance');
    }

    const a = new DataArray();
    a.setValuesList(els);
    const d = new Data();
    d.setArrayValue(a);
    this.addData(d);
  }

  addHash(len: number, doer: () => void) {
    this.stack.push(new Array<Data>());
    doer();
    const els = this.stack.pop();
    if (els === undefined) {
      throw new Error('Hash function caused data consumer unbalance');
    }

    if (els.length % 2 !== 0) {
      throw new Error('Hash function produced uneven number of elements');
    }
    const entries = new Array<DataEntry>();
    for (let i = 0; i < els.length; i += 2) {
      const de = new DataEntry();
      de.setKey(els[i]);
      de.setValue(els[i + 1]);
      entries.push(de);
    }
    const h = new DataHash();
    h.setEntriesList(entries);
    const d = new Data();
    d.setHashValue(h);
    this.addData(d);
  }

  addRef(ref: number) {
    const d = new Data();
    d.setReference(ref);
    this.addData(d);
  }

  canDoComplexKeys(): boolean {
    return true;
  }

  canDoBinary(): boolean {
    return true;
  }

  stringDedupThreshold(): number {
    return 0;
  }

  value(): Data {
    return this.stack[0][0];
  }

  private addData(value: Data) {
    this.stack[this.stack.length - 1].push(value);
  }
}

export function consumePBData(data: Data, consumer: ValueConsumer): void {
  switch (data.getKindCase().valueOf()) {
    case Data.KindCase.BOOLEAN_VALUE:
      consumer.add(data.getBooleanValue());
      break;
    case Data.KindCase.INTEGER_VALUE:
      consumer.add(data.getIntegerValue());
      break;
    case Data.KindCase.FLOAT_VALUE:
      consumer.add(data.getFloatValue());
      break;
    case Data.KindCase.STRING_VALUE:
      consumer.add(data.getStringValue());
      break;
    case Data.KindCase.ARRAY_VALUE:
      // @ts-ignore
      const av = data.getArrayValue().getValuesList();
      consumer.addArray(av.length, () => av.forEach((e) => consumePBData(e, consumer)));
      break;
    case Data.KindCase.HASH_VALUE:
      // @ts-ignore
      const hv = data.getHashValue().getEntriesList();
      consumer.addHash(hv.length, () => hv.forEach((entry: DataEntry) => {
        // @ts-ignore
        consumePBData(entry.getKey(), consumer);
        // @ts-ignore
        consumePBData(entry.getValue(), consumer);
      }));
      break;
    case Data.KindCase.BINARY_VALUE:
      consumer.add(data.getBinaryValue());
      break;
    case Data.KindCase.REFERENCE:
      consumer.addRef(data.getReference());
      break;
    default:
      consumer.add(null);
  }
}
