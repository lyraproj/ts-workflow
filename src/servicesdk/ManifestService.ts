import {NotNull, StringHash, Value} from '../pcore/Util';

import {Definition, ServiceBuilder, StateProducer} from './ServiceBuilder';

export class ManifestService {
  private readonly callables: {[s: string]: NotNull};
  private readonly definitions: Definition[];
  private readonly stateFunctions: {[s: string]: StateProducer};

  constructor(sb: ServiceBuilder) {
    const cbs = {};
    for (const [k, v] of Object.entries(sb.actionFunctions)) {
      cbs[k] = {do: v};
    }
    this.callables = cbs;
    this.definitions = sb.definitions;
    this.stateFunctions = sb.stateProducers;
  }

  invoke(identifier: string, name: string, args: Value[]): Value {
    const c = this.callables[identifier];
    if (c === undefined) {
      throw new Error(`Unable to find implementation of ${identifier}`);
    }
    const m = c[name];
    if (m === undefined) {
      throw new Error(`Implementation of ${identifier} has no method named ${name}`);
    }
    return m(...args);
  }

  metadata(): [Value, Definition[]] {
    return [null, this.definitions];
  }

  state(name: string, input: StringHash): Value {
    const f = this.stateFunctions[name];
    if (f === undefined) {
      throw new Error(`unable to find state producer for ${name}`);
    }

    const pns = parameterNames(f);
    const args = new Array<Value>();
    for (let i = 0; i < pns.length; i++) {
      const pn = pns[i];
      const v = input[pn];
      if (v === undefined) {
        throw Error(`state ${name} cannot be produced. Missing input parameter ${pn}`);
      }
      args.push(v);
    }
    return f(...args);
  }
}

const paramNamePattern = new RegExp('^(?:function(?:\\s+\\w+)?\\s*)?\\(([^)]*)\\)', 'm');

function parameterNames(s: StateProducer): string[] {
  // @ts-ignore
  return s.toString().match(paramNamePattern)[1].split(',').map(v => v.trim());
}
