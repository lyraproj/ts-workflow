import * as util from 'util';

import {PcoreValue} from './Serializer';
import {anyType, Type} from './Type';
import {StringHash, Value} from './Util';

export class Parameter implements PcoreValue {
  readonly name: string;
  readonly type: Type;
  readonly alias?: string;
  readonly value?: Value;

  constructor(name: string, type?: string|Type, value?: Value, alias?: string) {
    this.name = name;
    if (type === undefined) {
      type = anyType;
    } else if (typeof type === 'string') {
      type = new Type(type);
    }

    this.type = type;
    this.value = value;
    this.alias = alias;
  }

  [util.inspect.custom](depth: number, options: util.InspectOptions) {
    return `Parameter ${util.inspect(this.__pvalue(), options)}`;
  }

  __ptype(): string {
    return 'Lyra::Parameter';
  }

  __pvalue(): StringHash {
    const m: StringHash = {name: this.name, type: this.type};
    if (this.value !== undefined) {
      m['value'] = this.value;
    }
    if (this.alias !== undefined) {
      m['alias'] = this.alias;
    }
    return m;
  }
}
