import {Namespace, TypedName} from "../pcore/TypedName";
import {PcoreObject} from "../pcore/Serializer";
import {anyType, Type} from "../pcore/Type";
import {Deferred} from "../pcore/Deferred";
import {Parameter} from "../pcore/Parameter";
import {isHash, StringHash, Value} from "../pcore/Util";
import * as util from "util";
import {Data} from "../pcore/Data";

/**
 * A StateProducer produces a state based on input variables
 */
export type StateProducer = Function;

/**
 * A StateProducer produces a state based on input variables
 */
export type ActionFunction = Function;

export type InParam = { type?: string, lookup?: Data };

export type OutParam = { type?: string, alias?: string };

/**
 * The ActivityMap contains the properties common to all Activities
 */
export interface ActivityMap {
  style?: 'action' | 'resource' | 'workflow';
  input?: string | string[] | { [s: string]: string | InParam };
  output?: string | string[] | { [s: string]: string | OutParam };
  when?: string;
}

export function isActivityMap(m : ActivityMap) : m is ActivityMap {
  const s = m.style;
  return s === 'action' || s === 'resource' || s === 'workflow';
}

/**
 * The ActionMap contains the properties of a workflow action.
 */
export interface ActionMap extends ActivityMap {
  do: ActionFunction;
}

/**
 * The ResourceMap contains the properties of a workflow resource.
 */
export interface ResourceMap extends ActivityMap {
  externalId?: string;
  state: StateProducer;
  type?: string;
}

export interface WorkflowMap extends ActivityMap {
  activities: {[s: string]: ActivityMap };
}

export function action(a : ActionMap) : ActivityMap {
  a.style = 'action';
  return a;
}

export function resource(a : ResourceMap) : ActivityMap {
  a.style = 'resource';
  return a;
}

export function workflow(a : WorkflowMap) : ActivityMap {
  a.style = 'workflow';
  return a;
}

export class ServiceBuilder {
  readonly serviceId : TypedName;
  readonly definitions : Definition[] = [];
  readonly stateProducers : {[s: string] : StateProducer} = {};
  readonly actionFunctions : StringHash = {};

  constructor(serviceName : string) {
    this.serviceId = new TypedName(Namespace.NsService, serviceName);
  }

  fromMap(n : string, a : ActivityMap, inferred : StringHash) {
    switch(a.style) {
    case 'action':
      const ab = new ActionBuilder(n, null);
      ab.fromMap((a as ActionMap));
      this.definitions.push(ab.build(this, inferred));
      break;
    case 'resource':
      const rb = new ResourceBuilder(n, null);
      rb.fromMap((a as ResourceMap));
      this.definitions.push(rb.build(this, inferred));
      break;
    case 'workflow':
      const wb = new WorkflowBuilder(n, null);
      wb.fromMap((a as WorkflowMap));
      this.definitions.push(wb.build(this, inferred));
      break;
    default:
      throw new Error(`activity hash for ${n} has no valid style`);
    }
  }
}

export class Definition implements PcoreObject {
  readonly identifier : TypedName;
  readonly serviceId : TypedName;
  readonly properties : StringHash;

  constructor(serviceId : TypedName, identifier : TypedName, properties : StringHash) {
    this.serviceId = serviceId;
    this.identifier = identifier;
    this.properties = properties;
  }

  toString() : string {
    return util.formatWithOptions({ depth: 10}, '%O', this);
  }

  __ptype() : string {
    return 'Service::Definition';
  }
}

export class ActivityBuilder {
  private readonly name: string;
  private readonly parent : ActivityBuilder | null;
  private in? : { [s: string]: Parameter };
  private out? : { [s: string]: Parameter };
  private guard? : string;

  constructor(name : string, parent : ActivityBuilder | null) {
    this.name = name;
    this.parent = parent;
  }

  amendWithInferredTypes(inferred : StringHash) {
    if(this.in === undefined) {
      const ii = inferred['input'];
      if(ii !== undefined) {
        this.input(ii as { [s: string]: string });
      }
    }
    if(this.out === undefined) {
      const io = inferred['output'];
      if(io !== undefined) {
        this.output(io as { [s: string]: string });
      }
    }
  }

  getLeafName() : string {
    return this.name;
  }

  getName() : string {
    return this.parent !== null ? this.parent.qualifyName(this.name) : this.name;
  }

  fromMap(m : ActivityMap) {
    if(m.when !== undefined) {
      this.when(m.when);
    }
    if(m.input !== undefined) {
      this.input(m.input);
    }
    if(m.output !== undefined) {
      this.output(m.output);
    }
  }

  when(guard : string) {
    this.guard = guard;
  }

  input(params : string | string[] | { [s: string]: string | InParam }) {
    const ps = this.convertParams(true, params);
    if(this.in === undefined) {
      this.in = ps;
    } else {
      Object.assign(this.in, ps);
    }
  }

  output(params : string | string[] | { [s: string]: string | OutParam }) {
    const ps = this.convertParams(false, params);
    if(this.out === undefined) {
      this.out = ps;
    } else {
      Object.assign(this.out, ps);
    }
  }

  build(sb : ServiceBuilder, inferred : StringHash) : Definition {
    if(inferred !== null) {
      this.amendWithInferredTypes(inferred);
    }
    return new Definition(sb.serviceId, new TypedName(Namespace.NsDefinition, this.getName()), this.definitionProperties(sb, inferred));
  }

  protected qualifyName(n : string) : string {
    return this.getName() + '::' + n;
  }

  private convertParams(isIn : boolean, params : string | string[] | { [s: string]: string | InParam | OutParam }): { [s: string]: Parameter }  {
    const result = {};
    if(typeof params === 'string') {
      // A single untyped parameter name
      result[params] = new Parameter(params, anyType);
    } else if(Array.isArray(params)) {
      // Array of untyped parameter names
      params.forEach((p : string) => {
        result[p] = new Parameter(p, anyType);
      });
    } else {
      // Map of typed parameters
      for(const [key, value] of Object.entries(params)) {
        let type = anyType;
        if(typeof value === 'string') {
          type = new Type(value);
          result[key] = new Parameter(key, type);
        } else {
          if(value.hasOwnProperty('type')) {
            type = new Type(value['type'] as string);
          }

          // Input parameters can have lookup, output parameters can have alias.
          let alu : Value;
          if(isIn) {
            if(value.hasOwnProperty('lookup')) {
              alu = new Deferred('lookup', value['lookup']);
            } else {
              throw new Error(`illegal input parameter assignment for parameter ${key}: ${value.toString()}`);
            }
          } else {
            if(value.hasOwnProperty('alias')) {
              alu = value['alias'];
            } else {
              throw new Error(`illegal input parameter assignment for parameter ${key}: ${value.toString()}`);
            }
          }
          result[key] = new Parameter(key, type, alu);
        }
      }
    }
    return result;
  }

  protected definitionProperties(sb : ServiceBuilder, inferred : StringHash): StringHash {
    const props = {};
    if(this.in !== undefined) {
      props['input'] = this.in;
    }
    if(this.out !== undefined) {
      props['output'] = this.out;
    }
    if(this.guard !== undefined) {
      props['when'] = this.guard;
    }
    return props;
  }
}

export class ResourceBuilder extends ActivityBuilder {
  private extId?: string;
  private typ?: string;
  private stateProducer?: StateProducer;

  amendWithInferredTypes(inferred : StringHash) {
    super.amendWithInferredTypes(inferred);
    if(this.typ === undefined) {
      const it = inferred['type'];
      if(typeof it === 'string') {
        this.type(it);
      }
    }
  }

  externalId(extId : string) {
    this.extId = extId;
  }

  state(stateProducer: StateProducer) {
    this.stateProducer = stateProducer;
  }

  type(t: string) {
    this.typ = t;
  }

  build(sb : ServiceBuilder, inferred : StringHash) : Definition {
    if(this.stateProducer !== undefined) {
      sb.stateProducers[this.getName()] = this.stateProducer;
    }
    return super.build(sb, inferred);
  }

  fromMap(m : ResourceMap) {
    super.fromMap(m);
    this.state(m.state);
    if(m.type !== undefined) {
      this.type(m.type);
    }
    if(m.externalId !== undefined) {
      this.externalId(m.externalId);
    }
  }

  protected definitionProperties(sb : ServiceBuilder, inferred : StringHash): StringHash {
    const props = super.definitionProperties(sb, inferred);
    if(this.extId !== undefined) {
      props['external_id'] = this.extId;
    }
    if(this.typ !== undefined) {
      props['type'] = this.typ;
    }
    return props;
  }
}

export class ActionBuilder extends ActivityBuilder {
  private actionFunction?: ActionFunction;

  do(actionFunction: ActionFunction) {
    this.actionFunction = actionFunction;
  }

  build(sb : ServiceBuilder, inferred : StringHash) : Definition {
    if(this.actionFunction !== undefined) {
      sb.actionFunctions[this.getName()] = this.actionFunction;
    }
    return super.build(sb, inferred);
  }

  fromMap(m : ActionMap) {
    super.fromMap(m);
    this.do(m.do);
  }
}

export class WorkflowBuilder extends ActivityBuilder {
  private readonly activities: ActivityBuilder[] = [];

  amendWithInferredTypes(inferred : StringHash) {
    super.amendWithInferredTypes(inferred);
    this.activities.forEach(a => {
      const sub = inferred[a.getLeafName()];
      if(isHash(sub)) {
        a.amendWithInferredTypes(sub);
      }
    });
  }

  fromMap(m : WorkflowMap) {
    super.fromMap(m);
    for(const [n, a] of Object.entries(m.activities)) {
      switch(a.style) {
      case 'action':
        const ab = new ActionBuilder(n, this);
        ab.fromMap((a as ActionMap));
        this.activities.push(ab);
        break;
      case 'resource':
        const rb = new ResourceBuilder(n, this);
        rb.fromMap((a as ResourceMap));
        this.activities.push(rb);
        break;
      case 'workflow':
        const wb = new WorkflowBuilder(n, this);
        wb.fromMap((a as WorkflowMap));
        this.activities.push(wb);
        break;
      default:
        throw new Error(`activity hash for ${this.qualifyName(n)} has no valid style`);
      }
    }
  }

  action(name : string, bf : (rb : ActionBuilder) => void) {
    const rb = new ActionBuilder(name, this);
    bf(rb);
    this.activities.push(rb);
  }

  resource(name : string, bf : (rb : ResourceBuilder) => void) {
    const rb = new ResourceBuilder(name, this);
    bf(rb);
    this.activities.push(rb);
  }

  workflow(name : string, bf : (rb : WorkflowBuilder) => void) {
    const rb = new WorkflowBuilder(name, this);
    bf(rb);
    this.activities.push(rb);
  }

  protected definitionProperties(sb : ServiceBuilder, inferred : StringHash): StringHash {
    const props = super.definitionProperties(sb, inferred);
    props['activities'] = this.activities.map(ab => ab.build(sb, inferred));
    return props;
  }
}
