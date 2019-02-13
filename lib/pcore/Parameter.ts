import * as util from 'util';

import {PcoreValue} from './Serializer';
import {anyType, Type} from './Type';
import {StringHash, Value} from './Util';

export class Parameter implements PcoreValue {
  readonly name: string;
  readonly type: Type;
  readonly value?: Value;
  readonly captures?: boolean;

  constructor(name: string, type?: string|Type, value?: Value, captures?: boolean) {
    this.name = name;
    if (type === undefined) {
      type = anyType;
    } else if (typeof type === 'string') {
      type = new Type(type);
    }

    this.type = type;
    this.value = value;
    this.captures = captures;
  }

  [util.inspect.custom](depth, options) {
    return `Parameter ${util.inspect(this.__pvalue(), depth, options)}`;
  }

  __ptype(): string {
    return 'Parameter';
  }

  __pvalue(): StringHash {
    const m = {name: this.name, type: this.type};
    if (this.value !== undefined) {
      m['value'] = this.value;
    }
    if (this.value === null) {
      m['has_value'] = true;
    }
    if (this.captures === true) {
      m['captures_rest'] = true;
    }
    return m;
  }
}
