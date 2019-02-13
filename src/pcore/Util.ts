export interface ValueArray extends Array<Value> {}
export interface ValueMap extends Map<Value,Value> {}
export interface StringMap extends Map<string,Value> {}
export interface StringHash {[s: string] : Value;}
export type NotNull = string | number | boolean | {} | Uint8Array | ValueMap | ValueArray;
export type Value = null | NotNull;

export function isHash(value : Value) : value is StringHash {
  return value !== null && typeof value === 'object' && value.constructor === Object;
}

export function strictString(value : Value) : string | undefined {
  if(value === null) {
    return undefined;
  }
  if(typeof value === 'string') {
    return value;
  }
  if(typeof value === 'object' && value.constructor === String) {
    return (value.valueOf() as string);
  }
  return undefined;
}

export function isStringMap(map : Value) : map is StringMap {
  if(map instanceof Map) {
    for(const key in map.keys()) {
      if(strictString(key) === undefined) {
        return false;
      }
    }
    return true;
  }
  return false;
}

export function makeInt(arg : NotNull) : number {
  let n = NaN;
  if(typeof arg === 'number') {
    n = arg;
  } else if(typeof arg === 'string') {
    n = Number(arg);
  }
  // TODO: Add hash constructor etc.
  if(isNaN(n) || (n % 1) !== 0) {
    throw new Error(`not an integer '${arg}'`);
  }
  return n;
}

export function makeFloat(arg : NotNull) : number {
  let n = NaN;
  if(typeof arg === 'number') {
    n = arg;
  } else if(typeof arg === 'string') {
    n = Number(arg);
  }
  // TODO: Add hash constructor etc.
  if(isNaN(n)) {
    throw new Error(`not a float '${arg}'`);
  }
  return n;
}

export function makeBoolean(arg : NotNull) : boolean {
  if(typeof arg === 'boolean') {
    return arg;
  }
  if(typeof arg === 'string') {
    switch(arg.toLowerCase()) {
    case 'true':
      return true;
    case 'false':
      return false;
    }
  }
  if(typeof arg === 'number') {
    return arg !== 0;
  }
  throw new Error(`not a boolean '${arg}'`);
}

export function makeString(arg : Value) : string | undefined {
  return arg === null ? undefined : arg.toString();
}
