import {Data, DataMap} from "./genesis";

class Builder {
  private value: any;
  private resolved: boolean;

  constructor(value :any) {
    this.value = value;
    this.resolved = true;
  }

  set(key : string | number, value : any) {
    this.value[key] = value;
    this.resolved = false;
  }

  resolve() : any {
    if(this.resolved)
      return this.value;

    this.resolved = true;
    if(Array.isArray(this.value)) {
      let x = <Array<any>>this.value;
      x.forEach((value : any, index : number) :void => {
        if(value instanceof Builder)
          x[index] = <Builder>value.resolve();
      });
    } else if(isHash(this.value)) {
      let x = <{}>this.value;
      for(let key in x) {
        if(x.hasOwnProperty(key)) {
          let value = x[key];
          if(value instanceof Builder)
            x[key] = <Builder>value.resolve();
        }
      }
    }
    return this.value;
  }
}

class ObjectHashBuilder extends Builder {
  private ctor : any;
  private instance: any;

  constructor(ctor : any, instance: any) {
    super({});
    this.ctor = ctor;
    this.instance = instance;
  }

  resolve() : any {
    let inst = this.instance;
    this.ctor.apply(inst, [super.resolve()]);
    return inst;
  }
}

class ObjectArrayBuilder extends Builder {
  private ctor : any;
  private instance: any;

  constructor(ctor : any, instance: any) {
    super([]);
    this.ctor = ctor;
    this.instance = instance;
  }

  resolve() : any {
    let inst = this.instance;
    this.ctor.apply(inst, super.resolve());
    return inst;
  }
}

class JsonPathResolver {
  private root : Builder;

  constructor(root : Builder) {
    this.root = root;
  }

  resolve(path : string) : any {
    // TODO:
    return this.root;
  }
}

export const PTYPE_KEY = '__ptype';
export const PVALUE_KEY = '__pvalue';

export const DEFAULT = Symbol('default');

function hashSelect(hash : DataMap, predicate : (key : string, value : Data) => boolean) : DataMap {
  let result : DataMap = {};
  for(let key in hash)
    if(hash.hasOwnProperty(key)) {
      let value = hash[key];
      if(predicate(key, value))
        result[key] = value;
    }
  return result;
}

function isHash(value : any) : value is {} {
  return typeof value === 'object' && value.constructor === Object;
}

export class FromDataConverter {
  private allowUnresolved : boolean;
  private procs: {[s: string]: (hash: DataMap, typeValue? : any) => any };
  private current : null | Builder;
  private root : null | Builder;
  private key : string | number;
  private loader : {};

  constructor(loader : {}, allowUnresolved : boolean) {
    this.allowUnresolved = allowUnresolved;
    this.current = null;
    this.root = null;
    this.loader = loader;
    this.procs = new Proxy({
      Hash: (hash : DataMap) : any => {
        let value = <Array<any>>hash[PVALUE_KEY];
        return this.build({}, () : void => {
          for(let idx = 0; idx < value.length;) {
            let key = this.withoutValue(() => this.convert(value[idx++]));
            this.withKey(key, () => this.convert(value[idx++]));
          }
        });
      },
      Default:  () : any => this.build(DEFAULT),
      LocalRef: (hash : DataMap) : any => this.build(new JsonPathResolver(this.root).resolve(<string>hash[PVALUE_KEY])),
    }, {
      get: (obj : {}, key : string) => {
        return obj.hasOwnProperty(key) ? obj[key] : (hash : DataMap, typeValue : any) : any => {
          let value = hash.hasOwnProperty(PVALUE_KEY) ? hash[PVALUE_KEY] : hashSelect(hash, (key) => key !== PTYPE_KEY);
          if(isHash(typeValue)) {
            let type = this.withoutValue(() => this.convert(typeValue));
            if(isHash(type)) {
              if(this.allowUnresolved)
                return hash;
              throw new Error(`Unable to deserialize type from ${type}`);
            }
            return this.ptypeHashToValue(type, value);
          }

          let type = this.parseType(<string>typeValue);
          if(type === undefined) {
            if(this.allowUnresolved) {
              return hash;
            }
            throw new Error(`No implementation mapping found for Puppet Type ${typeValue}`);
          }
          return this.ptypeHashToValue(type, value);
        }
      }
    });
  }

  convert(value : Data) : any {
    if(isHash(value)) {
      let hash = <DataMap>value;
      let pType = value[PTYPE_KEY];
      if (pType !== undefined)
        return this.procs[pType].call(this, hash, pType);

      return this.build({}, () => {
        for(let key in hash)
          this.withKey(key, this.convert(value[key]));
      })
    }
    return this.build(value);
  }

  build(value : any, func? : () => void) : any {
    let vx = new Builder(value);
    if(this.current !== null) {
      this.current.set(this.key, vx);
    }
    if(func !== undefined)
      this.withValue(vx, func);
    return vx.resolve();
  }

  buildObject(builder : Builder, func : () => void) : any {
    if(this.current !== null)
      this.current[this.key] = builder;
    this.withValue(builder, func);
    return builder.resolve();
  }

  withKey(key : any, func : () => void) : void {
    let parentKey = this.key;
    this.key = key;
    func();
    this.key = parentKey;
 }

  withValue(vx : Builder, func : () => any) : any {
    if(this.root === null)
      this.root = vx;

    let parent = this.current;
    this.current = vx;
    let value = func();
    this.current = parent;
    return value;
  }

  withoutValue(func : () => any) : any {
    let parent = this.current;
    this.current = null;
    let value = func();
    this.current = parent;
    return value;
  }

  private ptypeHashToValue(type: any, value: Data) : any {

    if(isHash(value)) {
      let hash = <DataMap>value;
      let tf = function(){};
      tf.prototype = type.prototype;
      let inst = new tf;
      let keys = Object.keys(hash);
      if(keys.length === 0)
        return this.build(inst);

      if(type.prototype._pname !== undefined) {
        return this.buildObject(new ObjectHashBuilder(type, inst), () : void => {
          for(let key in hash) {
            this.withKey(key, () => this.convert(hash[key]));
          }
        })
      }

      return this.buildObject(new ObjectArrayBuilder(type, inst), () : void => {
        for(let idx in keys) {
          this.withKey(idx, () => this.convert(hash[keys[idx]]));
        }
      })
    }
    if(typeof value == 'string') {
      return this.build(new type(value));
    }
  }

  private parseType(typeString: string) : any {
    let parts = typeString.split('::');
    let c = this.loader;
    for(let i in parts) {
      c = c[parts[i]];
      if(c === undefined)
        break;
    }
    if(c !== undefined && typeof c !== 'function')
      // Not a function, so not a constructor
      c = undefined;
    return c;
  }
}
