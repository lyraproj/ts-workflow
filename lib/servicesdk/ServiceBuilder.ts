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
 * A StateProducer produces a state based on input variables
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

export interface Iteration {
  variable?: string;
}

export interface Times extends Iteration {
  times: InParam|number;
}

function isTimes(value: Iteration): value is Times {
  return (value as Times).times !== undefined;
}

export interface Range extends Iteration {
  from: InParam|number;
  to: InParam|number;
}

function isRange(value: Iteration): value is Range {
  return (value as Range).to !== undefined;
}

export interface Each extends Iteration {
  each: InParam|DataArray|StringDataMap;
  variables?: string[];
}

function isEach(value: Iteration): value is Each {
  return (value as Each).each !== undefined;
}

/**
 * The ActivityMap contains the properties common to all Activities
 */
export interface ActivityMap {
  name?: string;
  style?: 'action'|'resource'|'workflow';
  iteration?: Each|Range|Times;
  input?: string|string[]|{[s: string]: string | InParam};
  output?: string|string[]|{[s: string]: string | OutParam};
  when?: string;
}

export function isActivityMap(m: ActivityMap): m is ActivityMap {
  const s = m.style;
  return s === 'action' || s === 'resource' || s === 'workflow';
}

/**
 * The ActionMap contains the properties of a workflow action.
 */
export interface ActionMap extends ActivityMap {
  do: Function;
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
  activities: {[s: string]: ActivityMap};
}

export interface TopLevelActivityMap extends ActivityMap {
  source: string;
}

export function serveWorkflow(a: TopLevelActivityMap&WorkflowMap) {
  const sb = new ServiceBuilder('Lyra::TypeScript::Service');
  sb.workflow(a);
  sb.serve();
}

export function serveAction(a: TopLevelActivityMap&ActionMap) {
  const sb = new ServiceBuilder('Lyra::TypeScript::Service');
  sb.action(a);
  sb.serve();
}

export function serveResource(a: TopLevelActivityMap&ResourceMap) {
  const sb = new ServiceBuilder('Lyra::TypeScript::Service');
  sb.resource(a);
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

export function activityName(fileName: string): string {
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

  workflow(wm: WorkflowMap&TopLevelActivityMap) {
    this.fromMap(wm.source, WorkflowBuilder, workflow(wm));
  }

  resource(rm: ResourceMap&TopLevelActivityMap) {
    this.fromMap(rm.source, ResourceBuilder, resource(rm));
  }

  action(am: ActionMap&TopLevelActivityMap) {
    this.fromMap(am.source, ActionBuilder, action(am));
  }

  serve() {
    const server = this.build(global);
    logger.info('Starting the server', 'serverId', server.serviceId.toString());
    server.start();
  }

  private fromMap<T extends ActivityBuilder>(
      source: string, C: {new(n: string, p?: ActivityBuilder): T}, map: ActivityMap): void {
    const an = activityName(source);
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

export abstract class ActivityBuilder {
  private readonly parent: ActivityBuilder|null;
  private name: string;
  private in ?: {[s: string]: Parameter};
  private out?: {[s: string]: Parameter};
  private guard?: string;

  constructor(name: string, parent?: ActivityBuilder) {
    this.name = name;
    this.parent = parent === undefined ? null : parent;
  }

  amendWithInferredTypes(inferred: StringHash) {
    if (this.in === undefined) {
      const ii = inferred['input'];
      if (ii !== undefined) {
        this.input(ii as {[s: string]: string});
      }
    }
    if (this.out === undefined) {
      const io = inferred['output'];
      if (io !== undefined) {
        this.output(io as {[s: string]: string});
      }
    }
  }

  getLeafName(): string {
    return this.name;
  }

  getName(): string {
    return this.parent !== null ? this.parent.qualifyName(this.name) : this.name;
  }

  fromMap(m: ActivityMap) {
    if (m.name !== undefined) {
      this.name = m.name;
    }
    if (m.when !== undefined) {
      this.when(m.when);
    }
    if (m.input !== undefined) {
      this.input(m.input);
    }
    if (m.output !== undefined) {
      this.output(m.output);
    }
  }

  when(guard: string) {
    this.guard = guard;
  }

  input(params: string|string[]|{[s: string]: string | InParam}) {
    const ps = this.convertParams(true, params);
    if (this.in === undefined) {
      this.in = ps;
    } else {
      Object.assign(this.in, ps);
    }
  }

  output(params: string|string[]|{[s: string]: string | OutParam}) {
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

          // Input parameters can have lookup, output parameters can have alias.
          let alu: Value;
          if (isIn) {
            const luv = (value as InParam).lookup;
            if (luv !== undefined) {
              alu = new Deferred('lookup', luv);
            } else {
              throw new Error(`illegal input parameter assignment for parameter ${key}: ${value.toString()}`);
            }
          } else {
            const av = (value as OutParam).alias;
            if (av !== undefined) {
              alu = av;
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

  protected definitionProperties(sb: ServiceBuilder, inferred: StringHash|null): StringHash {
    const props: StringHash = {};
    if (this.in !== undefined) {
      props['input'] = Object.values(this.in);
    }
    if (this.out !== undefined) {
      props['output'] = Object.values(this.out);
    }
    if (this.guard !== undefined) {
      props['when'] = this.guard;
    }
    return props;
  }
}

export class ResourceBuilder extends ActivityBuilder {
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

export class ActionBuilder extends ActivityBuilder {
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

class IteratorBuilder extends ActivityBuilder {
  private readonly iter: Iteration;
  private readonly producer: ActivityBuilder;

  constructor(name: string, iter: Iteration, producer: ActivityBuilder, parent?: ActivityBuilder) {
    super(name, parent);
    this.iter = iter;
    this.producer = producer;
  }

  amendWithInferredTypes(inferred: StringHash) {
    super.amendWithInferredTypes(inferred);
    this.producer.amendWithInferredTypes(inferred);
  }

  protected definitionProperties(sb: ServiceBuilder, inferred: StringHash|null): StringHash {
    let style: string;
    let values: Value;
    let vars: string[] = [];
    if (this.iter.variable !== undefined) {
      vars.push(this.iter.variable);
    }
    if (isEach(this.iter)) {
      style = 'each';
      values = this.iter.each;
      if (this.iter.variables !== undefined) {
        vars = this.iter.variables;
      }
    } else if (isRange(this.iter)) {
      style = 'range';
      values = [this.iter.from, this.iter.to];
    } else if (isTimes(this.iter)) {
      style = 'times';
      values = this.iter.times;
    } else {
      style = 'unknown';
      values = null;
    }

    const pd = this.producer.build(sb, inferred);
    return {
      style: 'iterator',
      iterationStyle: style,
      over: values,
      variables: vars.map((vr) => new Parameter(vr)),
      producer: pd
    };
  }
}

export class WorkflowBuilder extends ActivityBuilder {
  private readonly activities: ActivityBuilder[] = [];

  amendWithInferredTypes(inferred: StringHash) {
    super.amendWithInferredTypes(inferred);
    this.activities.forEach(a => {
      const sub = inferred[a.getLeafName()];
      if (isHash(sub)) {
        a.amendWithInferredTypes(sub);
      }
    });
  }

  fromMap(m: WorkflowMap) {
    super.fromMap(m);
    for (const [n, a] of Object.entries(m.activities)) {
      let ab: ActivityBuilder;
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
          throw new Error(`activity hash for ${this.qualifyName(n)} has no valid style`);
      }
      ab.fromMap(a);
      if (a.iteration !== undefined) {
        ab = new IteratorBuilder(n, a.iteration, ab, this);
        ab.fromMap(a);
      }
      this.activities.push(ab);
    }
  }

  action(name: string, bf: (rb: ActionBuilder) => void) {
    const rb = new ActionBuilder(name, this);
    bf(rb);
    this.activities.push(rb);
  }

  resource(name: string, bf: (rb: ResourceBuilder) => void) {
    const rb = new ResourceBuilder(name, this);
    bf(rb);
    this.activities.push(rb);
  }

  workflow(name: string, bf: (rb: WorkflowBuilder) => void) {
    const rb = new WorkflowBuilder(name, this);
    bf(rb);
    this.activities.push(rb);
  }

  protected definitionProperties(sb: ServiceBuilder, inferred: StringHash|null): StringHash {
    const props = super.definitionProperties(sb, inferred);
    props['activities'] = this.activities.map(ab => ab.build(sb, inferred));
    props['style'] = 'workflow';
    return props;
  }
}
