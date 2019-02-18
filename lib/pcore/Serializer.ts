import {Context} from './Context';
import {Sensitive} from './Sensitive';
import {initializerFor} from './Type';
import {isHash, isStringMap, NotNull, strictString, StringHash, Value} from './Util';

export const PTYPE_KEY = '__ptype';
export const PVALUE_KEY = '__pvalue';

export interface PcoreObject {
  __ptype(): string;
}

export interface PcoreValue extends PcoreObject {
  __pvalue(): string|number|StringHash;
}

export function isPcoreObject(value: object): value is PcoreObject {
  // @ts-ignore
  return value !== null && typeof value[PTYPE_KEY] === 'function';
}

export function isPcoreValue(value: object): value is PcoreValue {
  // @ts-ignore
  return value !== null && typeof value[PVALUE_KEY] === 'function';
}

export const DEFAULT = Symbol('default');


const enum DedupLevel {
  NoDedup,
  NoKeyDedup,
  MaxDedup
}

export interface ValueConsumer {
  canDoBinary(): boolean;
  canDoComplexKeys(): boolean;
  add(value: boolean|number|string|Uint8Array|null): void;
  addArray(len: number, doer: () => void): void;
  addHash(len: number, doer: () => void): void;
  addRef(ref: number): void;
  stringDedupThreshold(): number;
}

export class Serializer {
  readonly context: Context;
  readonly richData: boolean;
  readonly dedupLevel: DedupLevel;

  constructor(c: Context, options: {rich_data?: boolean, dedup_level?: DedupLevel}) {
    this.context = c;
    this.dedupLevel = options.dedup_level === undefined ? DedupLevel.MaxDedup : options.dedup_level;
    this.richData = options.rich_data === undefined ? true : options.rich_data;
  }

  convert(value: Value, consumer: ValueConsumer) {
    const c = new SerializerContext(
        this, consumer,
        this.dedupLevel >= DedupLevel.MaxDedup && !consumer.canDoComplexKeys() ? DedupLevel.NoKeyDedup :
                                                                                 this.dedupLevel);
    c.toData(1, value);
  }
}

class SerializerContext {
  private readonly config: Serializer;
  private readonly consumer: ValueConsumer;
  private readonly values: Map<Value, number>;
  private readonly strings: {[s: string]: number};
  private readonly path: Value[];
  private readonly dedupLevel: number;
  private refIndex: number;

  constructor(config: Serializer, consumer: ValueConsumer, dedupLevel: DedupLevel) {
    this.config = config;
    this.consumer = consumer;
    this.dedupLevel = dedupLevel;
    this.values = new Map<Value, number>();
    this.strings = {};
    this.path = [];
    this.refIndex = 0;
  }

  toData(level: number, value: Value) {
    if (value === null || value === undefined) {
      this.addData(null);
      return;
    }

    switch (typeof value) {
      case 'number':
      case 'boolean':
        this.addData(value as number | boolean);
        break;
      case 'string':
        this.addString(level, value as string);
        break;
      case 'function':
        if (this.config.richData) {
          // A constructor actually denotes a type
          const tn = this.config.context.typeNames.nameForType(value as Function);
          if (tn === undefined) {
            throw new Error(`${this.pathToString()}: unable to serialize function ${value}`);
          }
          this.process(value, () => this.addHash(1, () => {
            this.addString(2, PTYPE_KEY);
            this.addString(1, tn);
          }));
        } else {
          this.unknownToStringWithWarning(level, value);
        }
        break;
      case 'object':
        switch (value.constructor) {
          case Object:
            this.process(value, () => {
              const h = (value as StringHash);
              const keys = Object.keys(h);
              this.addHash(keys.length, () => {
                for (const key in h) {
                  if (value.hasOwnProperty(key)) {
                    const prop = h[key];
                    if (typeof prop !== 'function') {
                      this.addString(2, key);
                      this.withPath(key, () => this.toData(1, prop));
                    }
                  }
                }
              });
            });
            break;
          case Map:
            this.process(value, () => {
              const h = (value as Map<Value, Value>);
              this.addHash(h.size, () => {
                if (this.consumer.canDoComplexKeys() || isStringMap(h)) {
                  h.forEach((value, key) => {
                    this.toData(2, key);
                    this.withPath(key, () => this.toData(1, value));
                  });
                } else {
                  this.nonStringKeyedHashToData(h);
                }
              });
            });
            break;
          case Array:
            this.process(value, () => {
              const arr = (value as Value[]);
              this.addArray(arr.length, () => {
                for (let idx = 0; idx < arr.length; idx++) {
                  this.withPath(idx, () => this.toData(1, arr[idx]));
                }
              });
            });
            break;
          case Date:
            this.process(value, () => this.addHash(2, () => {
              this.addString(2, PTYPE_KEY);
              this.addString(1, 'Timestamp');
              this.addString(2, PVALUE_KEY);
              this.withPath(PVALUE_KEY, () => this.addData((value as Date).toISOString()));
            }));
            break;
          case RegExp:
            this.process(value, () => this.addHash(2, () => {
              this.addString(2, PTYPE_KEY);
              this.addString(1, 'Regexp');
              this.addString(2, PVALUE_KEY);
              this.withPath(PVALUE_KEY, () => this.addData((value as RegExp).source));
            }));
            break;
          case String:
            this.addString(level, value.valueOf() as string);
            break;
          case Number:
          case Boolean:
            this.addData(value.valueOf() as number | boolean);
            break;
          case Sensitive:
            if (this.config.richData) {
              this.process(value, () => this.addHash(2, () => {
                this.addString(2, PTYPE_KEY);
                this.addString(1, 'Sensitive');
                this.addString(2, PVALUE_KEY);
                this.withPath(PVALUE_KEY, () => this.toData(1, (value as Sensitive).unwrap()));
              }));
            } else {
              this.unknownToStringWithWarning(level, value);
            }
            break;
          case undefined:
            this.addData(null);
            break;
          default:
            if (this.config.richData) {
              this.valueToDataHash(value);
            } else {
              this.unknownToStringWithWarning(1, value);
            }
        }
    }
  }

  private nonStringKeyedHashToData(hash: Map<Value, Value>) {
    if (this.config.richData) {
      this.toKeyExtendedHash(hash);
      return;
    }

    this.process(hash, () => this.addHash(hash.size, () => hash.forEach((v, k) => {
      const s = strictString(k);
      if (s !== undefined) {
        this.addString(2, s);
        this.withPath(s, () => this.toData(1, v));
      } else {
        this.unknownToStringWithWarning(2, k as NotNull);
        this.withPath(k, () => this.toData(1, v));
      }
    })));
  }

  private toKeyExtendedHash(hash: Map<Value, Value>) {
    this.process(hash, () => this.addHash(2, () => {
      this.addString(2, PTYPE_KEY);
      this.addString(1, 'Hash');
      this.addString(2, PVALUE_KEY);
      this.addArray(hash.size * 2, () => hash.forEach((v, k) => {
        this.toData(1, k);
        this.withPath(k, () => this.toData(1, v));
      }));
    }));
  }

  private valueToDataHash(value: object) {
    const pt = isPcoreObject(value) ? value.__ptype() : this.config.context.typeNames.nameForType(value.constructor);
    if (pt === undefined) {
      this.unknownToStringWithWarning(1, value);
      return;
    }

    this.process(value, () => {
      const pv = isPcoreValue(value) ? value.__pvalue() : initializerFor(value);
      if (isHash(pv)) {
        const es = Object.entries(pv);
        this.addHash(es.length + 1, () => {
          this.addString(2, PTYPE_KEY);
          this.addString(1, pt);
          for (const [k, v] of es) {
            this.addString(2, k);
            this.toData(1, v);
          }
        });
      } else {
        this.addHash(2, () => {
          this.addString(2, PTYPE_KEY);
          this.addString(1, pt);
          this.addString(2, PVALUE_KEY);
          this.withPath(PVALUE_KEY, () => this.toData(1, pv));
        });
      }
    });
  }

  private addArray(len: number, doer: () => void) {
    this.refIndex++;
    this.consumer.addArray(len, doer);
  }

  private addHash(len: number, doer: () => void) {
    this.refIndex++;
    this.consumer.addHash(len, doer);
  }

  private addString(level: number, value: string) {
    if (this.dedupLevel >= level && value.length > this.consumer.stringDedupThreshold()) {
      const ref = this.strings[value];
      if (ref !== undefined) {
        this.consumer.addRef(ref);
        return;
      } else {
        this.strings[value] = this.refIndex;
      }
    }
    this.addData(value);
  }

  private addData(value: boolean|number|string|null) {
    this.refIndex++;
    this.consumer.add(value);
  }

  private pathToString(): string {
    return this.path.join('/');
  }

  private process(value: Value, doer: () => void): void {
    if (this.dedupLevel === DedupLevel.NoDedup) {
      doer();
      return;
    }
    const ref = this.values.get(value);
    if (ref !== undefined) {
      this.consumer.addRef(ref);
    } else {
      this.values.set(value, this.refIndex);
      doer();
    }
  }

  private unknownToStringWithWarning(level: DedupLevel, value: NotNull) {
    const s = value.toString();
    let ts: string = typeof value;
    if (ts === 'object') {
      ts = value.constructor.name;
    }
    this.config.context.logger.warning(
        '%s contains a value of type %s. It will be converted to the string \'%s\'', this.pathToString(), ts, s);
    this.addString(level, s);
  }

  private withPath(value: Value, doer: () => void): void {
    this.path.push(value);
    doer();
    this.path.pop();
  }
}
