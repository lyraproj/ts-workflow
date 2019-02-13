import {PcoreValue} from './Serializer';
import {StringHash, Value} from './Util';

export class Deferred implements PcoreValue {
  readonly name: string;
  readonly args: Value[];

  constructor(name: string, ...args: Value[]) {
    this.name = name;
    this.args = args;
  }

  __ptype(): string {
    return 'Deferred';
  }

  __pvalue(): StringHash {
    return {name: this.name, arguments: this.args};
  }
}
