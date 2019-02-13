import {Value} from 'google-protobuf/google/protobuf/struct_pb';

import {MemCollector} from './Collector';
import {Context} from './Context';
import {Data, StringDataMap} from './Data';
import {Sensitive} from './Sensitive';
import {DEFAULT, PTYPE_KEY, PVALUE_KEY} from './Serializer';
import {isStringMap} from './Util';

export class Deserializer extends MemCollector {
  private readonly allowUnresolved: boolean;
  private readonly context: Context;
  private readonly converted: Map<Data, Value>;
  private val: Value;

  constructor(ctx: Context, options: {allow_unresolved?: boolean}) {
    super();
    this.allowUnresolved = !!options.allow_unresolved;
    this.context = ctx;
    this.converted = new Map<Value, Value>();
  }

  value(): Value {
    if (this.val === undefined) {
      this.val = this.convert(super.value() as Data);
    }
    return this.val;
  }

  private convert(value: Data): Value {
    const v = this.converted.get(value);
    if (v !== undefined) {
      return v;
    }

    if (isStringMap(value)) {
      const pcoreType = value.get(PTYPE_KEY);
      if (pcoreType !== undefined) {
        switch (pcoreType) {
          case 'Hash':
            return this.convertHash(value);
          case 'Sensitive':
            return this.convertSensitive(value);
          case 'Default':
            return DEFAULT;
        }
        return this.convertOther(value, pcoreType);
      }
    }
  }

  private convertHash(hash: Map<string, Value>): Map<Value, Value> {
    const value = (hash.get(PVALUE_KEY) as Value[]);
    const result = new Map<Value, Value>();
    this.converted.set(hash, result);
    for (let idx = 0; idx < value.length; idx += 2) {
      result.set(this.convert(value[idx]), this.convert(value[idx + 1]));
    }
    return result;
  }

  private convertSensitive(hash: StringDataMap): Sensitive {
    const v = hash.get(PVALUE_KEY);
    if (v === undefined) {
      throw new Error('missing required __pvalue key');
    }
    const sv = new Sensitive(this.convert(v));
    this.converted.set(hash, sv);
    return sv;
  }

  private convertOther(hash: Map<string, Value>, pcoreType: Value): Value {
    let value = hash.get(PVALUE_KEY);
    if (value === undefined) {
      hash.delete(PTYPE_KEY);
      value = hash;
    }
    if (pcoreType instanceof Map) {
      // Type deserialization is not supported in typescript
      throw Error('Deserialization of types is not supported');
    }
    const typ = this.context.parseType(pcoreType);
    if (typ === undefined) {
      if (this.allowUnresolved) {
        return value;
      }
      throw Error(`Deserialization of value of unknown type ${pcoreType}`);
    }
    return this.context.createInstance(typ, value);
  }
}
