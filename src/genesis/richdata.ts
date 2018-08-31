import {Sensitive} from "./sensitive";

export const PTYPE_KEY = '__ptype';
export const PVALUE_KEY = '__pvalue';

export const DEFAULT = Symbol('default');

// Data must be declared this way to avoid circular reference errors from TypeScript
export interface DataMap { [x: string]: Data }
export interface DataArray extends Array<Data> {}
export type Data = null | string | number | boolean | DataMap | DataArray

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
  return value && typeof value === 'object' && value.constructor === Object;
}

export namespace Foo {
  export namespace Bar {
    export class Fum {}
  }
}

export class FromDataConverter {
  private readonly procs: {[s: string]: (hash: DataMap, typeValue? : any) => any };
  private readonly loader : {};

  constructor(loader : {}) {
    this.loader = loader;
    this.procs = new Proxy({
      Hash: (hash : DataMap) : any => {
        let kvArray = <Array<any>>hash[PVALUE_KEY];
        let result = new Map();
        for(let idx = 0; idx < kvArray.length;) {
          let key = this.convert(kvArray[idx++]);
          let value = this.convert(kvArray[idx++]);
          result.set(key, value);
        }
        return result;
      },
      Sensitive: (hash : DataMap) : any => new Sensitive(this.convert(hash[PVALUE_KEY])),
      Default:  () : any => DEFAULT,
    }, {
      get: (obj : {}, key : string) => {
        return obj.hasOwnProperty(key) ? obj[key] : (hash : DataMap, typeValue : any) : any => {
          let value = hash.hasOwnProperty(PVALUE_KEY) ? hash[PVALUE_KEY] : hashSelect(hash, (key) => key !== PTYPE_KEY);
          if(isHash(typeValue)) {
            let type = this.convert(typeValue);
            if(isHash(type))
              throw new Error(`Unable to deserialize type from ${type}`);

            return this.ptypeHashToValue(type, value);
          }

          let type = this.parseType(<string>typeValue);
          if(type === undefined)
            throw new Error(`No implementation mapping found for Puppet Type ${typeValue}`);

          return this.ptypeHashToValue(type, value);
        }
      }
    });
  }

  convert(value : Data) : any {
    if(isHash(value)) {
      let hash = <DataMap>value;
      let pType = value[PTYPE_KEY];
      return (pType !== undefined) ? this.procs[pType].call(this, hash, pType) : this.convertHash(hash);
    }
    if(Array.isArray(value)) {
      return (<DataArray>value).map(this.convert);
    }
    return value;
  }

  private convertHash(hash : DataMap) : {} {
    let result = {};
    for(let key in hash) {
      if(hash.hasOwnProperty(key))
        result[key] = this.convert(hash[key]);
    }
    return result;
  }

  private ptypeHashToValue(type: any, value: Data) : any {
    let hash = <DataMap>value;
    let tf = function(){};
    tf.prototype = type.prototype;
    let inst = new tf;

    if(isHash(value)) {
      let keys = Object.keys(hash);
      if(keys.length === 0)
        return inst;

      if(type.prototype.__ptype !== undefined)
        type.apply(inst, [this.convertHash(hash)]);
      else
        type.apply(inst, keys.map((key) => this.convert(hash[key])));
      return inst;
    }

    type.apply(inst, [this.convert(value)]);
    return inst;
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

export class TypeNames {
  private typeMap : Map<()=>void, string>;

  constructor(base : {}) {
    let tn = new Map<()=>void, string>();
    TypeNames.createTypeMap(null, base, tn);
    this.typeMap = tn;
  }

  nameForType(type : ()=>void) : string {
    return this.typeMap.get(type);
  }

  private static createTypeMap(ns : string, base : any, map : Map<()=>void, string>) : void {
    if(typeof base === 'function') {
      map.set(base, ns);
      return;
    }

    if(typeof base === 'object') {
      for (let key in base) {
        if (key.match(/^[A-Z]/)) {
          TypeNames.createTypeMap(ns === null ? key : ns + '::' + key, base[key], map);
        }
      }
    }
  }
}

export class ToDataConverter {
  private typeNames : TypeNames;

  constructor(base : {}) {
    this.typeNames = new TypeNames(base);
  }

  private static initializerFor(value : object) : {} {
    let init = {};
    for(let key in value) {
      if(value.hasOwnProperty(key)) {
        let prop = value[key];
        if(typeof prop !== 'function')
          init[key] = prop;
      }
    }
    return init;
  }

  convert(value : any) : Data {
    if(value === null || value === DEFAULT)
      return value;

    switch (typeof value) {
    case 'number':
      return <number>value;
    case 'boolean':
      return <boolean>value;
    case 'string':
      return <string>value;
    case 'object':
      switch (value.constructor) {
      case Array:
        return (<Array<Data>>value).map(this.convert);
      case Object:
        return this.convertHash(<{}>value);
      case String:
      case Number:
      case Boolean:
        return <Data>value.valueOf();
      case Sensitive:
        return { __ptype: 'Sensitive', __pvalue: (<Sensitive>value).unwrap() };
      case undefined:
        return null;
      default:
        let ptype = value.hasOwnProperty(PTYPE_KEY) ? value.__ptype() : this.typeNames.nameForType(value.constructor);
        if(ptype === undefined)
          break;

        let pv = value.hasOwnProperty(PVALUE_KEY) ? value.__pvalue() : ToDataConverter.initializerFor(value);
        return isHash(pv)
          ? Object.assign({ __ptype: ptype }, this.convertHash(pv))
          : { __ptype: ptype, __pvalue: pv };
      }
    }
    throw new Error(`unable to serialize object of kind ${value.constructor}`)
  }

  private convertHash(hash) : DataMap {
    let mapped : DataMap = {};
    for(let key in hash) {
      if(hash.hasOwnProperty(key))
        mapped[key] = this.convert(hash[key]);
    }
    return mapped;
  }
}