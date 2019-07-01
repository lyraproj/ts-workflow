import * as path from 'path';
import * as util from 'util';

import {logger} from '..';
import {Data, DataArray, StringDataMap} from '../pcore/Data';
import {Deferred} from '../pcore/Deferred';
import {Parameter} from '../pcore/Parameter';
import {PcoreObject} from '../pcore/Serializer';
import {anyType, initializerFor, Type} from '../pcore/Type';
import {Namespace, TypedName} from '../pcore/TypedName';
import {isHash, StringHash, Value} from '../pcore/Util';

import {extractTypeInfoByPath} from './ManifestTypes';
import {Service} from './Service';

/**
 * A StateProducer produces a state based on parameters variables
 */
export type StateProducer = Function;

export type InParam = {
  type?: string,
  lookup?: Data
};

export type OutParam = {
  type?: string,
  alias?: string
};

export interface Repeat {
  as?: string|string[];
}

export interface Times extends Repeat {
  times: InParam|number;
}

function isTimes(value: Repeat): value is Times {
  return (value as Times).times !== undefined;
}

export interface Range extends Repeat {
  from: InParam|number;
  to: InParam|number;
}

function isRange(value: Repeat): value is Range {
  return (value as Range).to !== undefined;
}

export interface Each extends Repeat {
  each: InParam|DataArray|StringDataMap;
}

function isEach(value: Repeat): value is Each {
  return (value as Each).each !== undefined;
}

/**
 * The StepMap contains the properties common to all Steps
 */
export interface StepMap {
  name?: string;
  style?: 'action'|'resource'|'call'|'workflow';
  repeat?: Each|Range|Times;
  parameters?: string|string[]|{[s: string]: string | InParam};
  returns?: string|string[]|{[s: string]: string | OutParam};
  when?: string;
}

export function isStepMap(m: StepMap): m is StepMap {
  const s = m.style;
  return s === 'action' || s === 'call' || s === 'resource' || s === 'workflow';
}

/**
 * The ActionMap contains the properties of a workflow action.
 */
export interface ActionMap extends StepMap {
  do: Function;
}

/**
 * The ResourceMap contains the properties of a workflow resource.
 */
export interface ResourceMap extends StepMap {
  externalId?: string;
  state: StateProducer;
  type?: string;
}

export interface WorkflowMap extends StepMap {
  steps: {[s: string]: StepMap};
}

export interface CallMap extends StepMap {
  // Parameters are for aliasing only here, so OutParam instead of InParam
  parameters?: string|string[]|{[s: string]: string | OutParam};
  call: string;
}

export interface TopLevelStepMap extends StepMap {
  source: string;
}

export function serveWorkflow(a: TopLevelStepMap&WorkflowMap) {
  const sb = new ServiceBuilder('Lyra::TypeScript::Service');
  sb.workflow(a);
  sb.serve();
}

export function serveAction(a: TopLevelStepMap&ActionMap) {
  const sb = new ServiceBuilder('Lyra::TypeScript::Service');
  sb.action(a);
  sb.serve();
}

export function serveResource(a: TopLevelStepMap&ResourceMap) {
  const sb = new ServiceBuilder('Lyra::TypeScript::Service');
  sb.resource(a);
  sb.serve();
}

export function serveCall(a: TopLevelStepMap&CallMap) {
  const sb = new ServiceBuilder('Lyra::TypeScript::Service');
  sb.call(a);
  sb.serve();
}

export function action(a: ActionMap): ActionMap {
  a.style = 'action';
  return a;
}

export function resource(a: ResourceMap): ResourceMap {
  a.style = 'resource';
  return a;
}

export function workflow(a: WorkflowMap): WorkflowMap {
  a.style = 'workflow';
  return a;
}

export function call(a: CallMap): CallMap {
  a.style = 'call';
  return a;
}

export function stepName(fileName: string): string {
  // TODO: Take file name relative to 'workflow' directory and create
  //  a qualified name based on that
  return path.basename(fileName, '.js');
}

export class ServiceBuilder {
  readonly serviceId: TypedName;
  readonly definitions: Definition[] = [];
  readonly stateProducers: {[s: string]: StateProducer} = {};
  readonly actionFunctions: {[s: string]: Function} = {};

  constructor(serviceName: string) {
    this.serviceId = new TypedName(Namespace.NsService, serviceName);
  }

  build(nsBase: Value): Service {
    return new Service(nsBase, this, 2000, 21000);
  }

  workflow(wm: WorkflowMap&TopLevelStepMap) {
    this.fromMap(wm.source, WorkflowBuilder, workflow(wm));
  }

  resource(rm: ResourceMap&TopLevelStepMap) {
    this.fromMap(rm.source, ResourceBuilder, resource(rm));
  }

  call(rm: CallMap&TopLevelStepMap) {
    this.fromMap(rm.source, CallBuilder, call(rm));
  }

  action(am: ActionMap&TopLevelStepMap) {
    this.fromMap(am.source, ActionBuilder, action(am));
  }

  serve() {
    const server = this.build(global);
    logger.info('Starting the server', 'serverId', server.serviceId.toString());
    server.start();
  }

  private fromMap<T extends StepBuilder>(source: string, C: {new(n: string, p?: StepBuilder): T}, map: StepMap): void {
    const an = stepName(source);
    const ab = new C(an);
    ab.fromMap(map);
    this.definitions.push(ab.build(this, extractTypeInfoByPath(source)));
  }
}

export class Definition implements PcoreObject {
  readonly identifier: TypedName;
  readonly serviceId: TypedName;
  readonly properties: StringHash;

  constructor(serviceId: TypedName, identifier: TypedName, properties: StringHash) {
    this.serviceId = serviceId;
    this.identifier = identifier;
    this.properties = properties;
  }

  [util.inspect.custom](depth: number, options: util.InspectOptions): string {
    return `Definition  + ${util.inspect(initializerFor(this), options)}`;
  }

  __ptype(): string {
    return 'Service::Definition';
  }
}

export abstract class StepBuilder {
  private readonly parent: StepBuilder|null;
  private name: string;
  private in ?: {[s: string]: Parameter};
  private out?: {[s: string]: Parameter};
  private guard?: string;

  constructor(name: string, parent?: StepBuilder) {
    this.name = name;
    this.parent = parent === undefined ? null : parent;
  }

  amendWithInferredTypes(inferred: StringHash) {
    if (this.in === undefined) {
      const ii = inferred['parameters'];
      if (ii !== undefined) {
        this.parameters(ii as {[s: string]: string});
      }
    }
    if (this.out === undefined) {
      const io = inferred['returns'];
      if (io !== undefined) {
        this.returns(io as {[s: string]: string});
      }
    }
  }

  getLeafName(): string {
    return this.name;
  }

  getName(): string {
    return this.parent !== null ? this.parent.qualifyName(this.name) : this.name;
  }

  fromMap(m: StepMap) {
    if (m.name !== undefined) {
      this.name = m.name;
    }
    if (m.when !== undefined) {
      this.when(m.when);
    }
    if (m.parameters !== undefined) {
      this.parameters(m.parameters);
    }
    if (m.returns !== undefined) {
      this.returns(m.returns);
    }
  }

  when(guard: string) {
    this.guard = guard;
  }

  parameters(params: string|string[]|{[s: string]: string | InParam}) {
    const ps = this.convertParams(true, params);
    if (this.in === undefined) {
      this.in = ps;
    } else {
      Object.assign(this.in, ps);
    }
  }

  returns(params: string|string[]|{[s: string]: string | OutParam}) {
    const ps = this.convertParams(false, params);
    if (this.out === undefined) {
      this.out = ps;
    } else {
      Object.assign(this.out, ps);
    }
  }

  build(sb: ServiceBuilder, inferred: StringHash|null): Definition {
    if (inferred !== null) {
      this.amendWithInferredTypes(inferred);
    }
    return new Definition(
        sb.serviceId, new TypedName(Namespace.NsDefinition, this.getName()), this.definitionProperties(sb, inferred));
  }

  protected qualifyName(n: string): string {
    return this.getName() + '::' + n;
  }

  private convertParams(isIn: boolean, params: string|string[]|{[s: string]: string | InParam | OutParam}):
      {[s: string]: Parameter} {
    const result: {[s: string]: Parameter} = {};
    if (typeof params === 'string') {
      // A single untyped parameter name
      result[params] = new Parameter(params, anyType);
    } else if (Array.isArray(params)) {
      // Array of untyped parameter names
      params.forEach((p: string) => {
        result[p] = new Parameter(p, anyType);
      });
    } else {
      // Map of typed parameters
      for (const [key, value] of Object.entries(params)) {
        let type = anyType;
        if (typeof value === 'string') {
          type = new Type(value);
          result[key] = new Parameter(key, type);
        } else {
          if (value.hasOwnProperty('type')) {
            type = new Type(value['type'] as string);
          }

          // Parameters parameters can have lookup, returns parameters can have alias.
          let val: Value|undefined;
          let alias: string|undefined;
          if (isIn) {
            const luv = (value as InParam).lookup;
            if (luv !== undefined) {
              val = new Deferred('lookup', luv);
            } else {
              throw new Error(`illegal parameters parameter assignment for parameter ${key}: ${value.toString()}`);
            }
          } else {
            const av = (value as OutParam).alias;
            if (av !== undefined) {
              alias = av;
            } else {
              throw new Error(`illegal parameters parameter assignment for parameter ${key}: ${value.toString()}`);
            }
          }
          result[key] = new Parameter(key, type, val, alias);
        }
      }
    }
    return result;
  }

  protected definitionProperties(sb: ServiceBuilder, inferred: StringHash|null): StringHash {
    const props: StringHash = {};
    if (this.in !== undefined) {
      props['parameters'] = Object.values(this.in);
    }
    if (this.out !== undefined) {
      props['returns'] = Object.values(this.out);
    }
    if (this.guard !== undefined) {
      props['when'] = this.guard;
    }
    return props;
  }
}

export class ResourceBuilder extends StepBuilder {
  private extId?: string;
  private resourceType?: string;
  private stateProducer?: StateProducer;

  amendWithInferredTypes(inferred: StringHash) {
    super.amendWithInferredTypes(inferred);
    if (this.resourceType === undefined) {
      const it = inferred['type'];
      if (typeof it === 'string') {
        this.type(it);
      }
    }
  }

  externalId(extId: string) {
    this.extId = extId;
  }

  state(stateProducer: StateProducer) {
    this.stateProducer = stateProducer;
  }

  type(t: string) {
    this.resourceType = t;
  }

  build(sb: ServiceBuilder, inferred: StringHash|null): Definition {
    if (this.stateProducer !== undefined) {
      sb.stateProducers[this.getName()] = this.stateProducer;
    }
    return super.build(sb, inferred);
  }

  fromMap(m: ResourceMap) {
    super.fromMap(m);
    this.state(m.state);
    if (m.type !== undefined) {
      this.type(m.type);
    }
    if (m.externalId !== undefined) {
      this.externalId(m.externalId);
    }
  }

  protected definitionProperties(sb: ServiceBuilder, inferred: StringHash|null): StringHash {
    const props = super.definitionProperties(sb, inferred);
    if (this.extId !== undefined) {
      props['external_id'] = this.extId;
    }
    if (this.resourceType !== undefined) {
      props['resourceType'] = new Type(this.resourceType);
    }
    props['style'] = 'resource';
    return props;
  }
}

export class ActionBuilder extends StepBuilder {
  private actionFunction?: Function;

  do
    (actionFunction: Function) {
      this.actionFunction = actionFunction;
    }

  build(sb: ServiceBuilder, inferred: StringHash|null): Definition {
    if (this.actionFunction !== undefined) {
      sb.actionFunctions[this.getName()] = this.actionFunction;
    }
    return super.build(sb, inferred);
  }

  protected definitionProperties(sb: ServiceBuilder, inferred: StringHash|null): StringHash {
    const props = super.definitionProperties(sb, inferred);
    props['style'] = 'action';
    return props;
  }

  fromMap(m: ActionMap) {
    super.fromMap(m);
    this.do(m.do);
  }
}

export class CallBuilder extends StepBuilder {
  private call?: string;

  callTo(call: string) {
    this.call = call;
  }

  protected definitionProperties(sb: ServiceBuilder, inferred: StringHash|null): StringHash {
    const props = super.definitionProperties(sb, inferred);
    props['style'] = 'call';
    if (this.call !== undefined) {
      props['call'] = this.call;
    }
    return props;
  }

  fromMap(m: CallMap) {
    super.fromMap(m);
    this.callTo(m.call);
  }
}

class RepeatBuilder extends StepBuilder {
  private readonly rpt: Repeat;
  private readonly producer: StepBuilder;

  constructor(name: string, rpt: Repeat, producer: StepBuilder, parent?: StepBuilder) {
    super(name, parent);
    this.rpt = rpt;
    this.producer = producer;
  }

  amendWithInferredTypes(inferred: StringHash) {
    super.amendWithInferredTypes(inferred);
    this.producer.amendWithInferredTypes(inferred);
  }

  protected definitionProperties(sb: ServiceBuilder, inferred: StringHash|null): StringHash {
    let style: string;
    let values: Value;
    if (isEach(this.rpt)) {
      style = 'each';
      values = this.rpt.each;
    } else if (isRange(this.rpt)) {
      style = 'range';
      values = [this.rpt.from, this.rpt.to];
    } else if (isTimes(this.rpt)) {
      style = 'times';
      values = this.rpt.times;
    } else {
      style = 'unknown';
      values = null;
    }

    const pd = this.producer.build(sb, inferred);
    const def: StringHash = {
      style: 'repeat',
      repeatStyle: style,
      over: values,
      producer: pd,
    };

    if (this.rpt.as !== undefined) {
      let vars: Parameter[];
      if (Array.isArray(this.rpt.as)) {
        vars = this.rpt.as.map((vr) => new Parameter(vr));
      } else {
        vars = [new Parameter(this.rpt.as)];
      }
      def['variables'] = vars;
    }
    return def;
  }
}

export class WorkflowBuilder extends StepBuilder {
  private readonly steps: StepBuilder[] = [];

  amendWithInferredTypes(inferred: StringHash) {
    super.amendWithInferredTypes(inferred);
    this.steps.forEach(a => {
      const sub = inferred[a.getLeafName()];
      if (isHash(sub)) {
        a.amendWithInferredTypes(sub);
      }
    });
  }

  fromMap(m: WorkflowMap) {
    super.fromMap(m);
    for (const [n, a] of Object.entries(m.steps)) {
      let ab: StepBuilder;
      switch (a.style) {
        case 'action':
          ab = new ActionBuilder(n, this);
          break;
        case 'resource':
          ab = new ResourceBuilder(n, this);
          break;
        case 'workflow':
          ab = new WorkflowBuilder(n, this);
          break;
        default:
          throw new Error(`step hash for ${this.qualifyName(n)} has no valid style`);
      }
      ab.fromMap(a);
      if (a.repeat !== undefined) {
        ab = new RepeatBuilder(n, a.repeat, ab, this);
        ab.fromMap(a);
      }
      this.steps.push(ab);
    }
  }

  action(name: string, bf: (rb: ActionBuilder) => void) {
    const rb = new ActionBuilder(name, this);
    bf(rb);
    this.steps.push(rb);
  }

  resource(name: string, bf: (rb: ResourceBuilder) => void) {
    const rb = new ResourceBuilder(name, this);
    bf(rb);
    this.steps.push(rb);
  }

  call(name: string, bf: (rb: CallBuilder) => void) {
    const rb = new CallBuilder(name, this);
    bf(rb);
    this.steps.push(rb);
  }

  workflow(name: string, bf: (rb: WorkflowBuilder) => void) {
    const rb = new WorkflowBuilder(name, this);
    bf(rb);
    this.steps.push(rb);
  }

  protected definitionProperties(sb: ServiceBuilder, inferred: StringHash|null): StringHash {
    const props = super.definitionProperties(sb, inferred);
    props['steps'] = this.steps.map(ab => ab.build(sb, inferred));
    props['style'] = 'workflow';
    return props;
  }
}
