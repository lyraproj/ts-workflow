import * as util from 'util';

import {PcoreValue} from './Serializer';
import {StringHash} from './Util';

export enum Namespace {
  NsType = 'type',
  NsFunction = 'function',
  NsInterface = 'interface',
  NsDefinition = 'definition',
  NsHandler = 'handler',
  NsService = 'service',
  NsActivity = 'activity',
  NsAllocator = 'allocator',
  NsConstructor = 'constructor'
}

export const runtimeAuthority = new URL('http://puppet.com/2016.1/runtime');

export class TypedName implements PcoreValue {
  private static readonly allowedCharacters = new RegExp('^[a-z][0-9_a-z]*$');

  readonly authority: URL;
  readonly namespace: Namespace;
  readonly name: string;
  readonly canonical: string;
  readonly parts: string[];

  constructor(namespace: Namespace, name: string, authority: URL = runtimeAuthority) {
    let parts = name.toLowerCase().split('::');
    if (parts.length > 0 && parts[0] === '' && name.length > 2) {
      // Name starts with '::'. Get rid of it.
      parts = parts.slice(1);
      name = name.substring(2);
    }
    parts.forEach((v) => {
      if (!TypedName.allowedCharacters.test(v)) {
        throw new Error(`Invalid characters in part '${v}' of name '${name}'`);
      }
    });
    this.namespace = namespace;
    this.name = name;
    this.authority = authority;
    this.parts = parts;
    this.canonical = `${this.authority}/${namespace}/${name}`.toLowerCase();
  }

  toString(): string {
    return `${this.authority}/${this.namespace}/${this.name}`;
  }

  [util.inspect.custom](depth: number, options: util.InspectOptions) {
    return `TypedName ${util.inspect(this.__pvalue(), options)}`;
  }

  __ptype(): string {
    return 'TypedName';
  }

  __pvalue(): string|StringHash {
    const mv: StringHash = {namespace: this.namespace.toString(), name: this.name};
    if (this.authority !== runtimeAuthority) {
      mv['authority'] = this.authority.toString();
    }
    return mv;
  }
}
