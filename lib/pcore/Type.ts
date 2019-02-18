import * as util from 'util';

import {PcoreValue} from './Serializer';
import {toPcoreType} from './TypeTransformer';
import {StringHash} from './Util';

export class Type implements PcoreValue {
  readonly typeString: string;

  constructor(typeString: string) {
    this.typeString = toPcoreType(typeString);
  }

  [util.inspect.custom]() {
    return this.typeString;
  }

  __ptype(): string {
    return 'Type';
  }

  __pvalue(): string {
    return this.typeString;
  }
}

export const anyType = new Type('Any');

export function initializerFor(value: object): StringHash {
  const init: StringHash = {};
  const h = value as StringHash;
  for (const key in h) {
    if (h.hasOwnProperty(key)) {
      const prop = h[key];
      if (typeof prop !== 'function') {
        init[key] = prop;
      }
    }
  }
  return init;
}
