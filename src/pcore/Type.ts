import {PcoreValue} from "./Serializer";
import {toPcoreType} from "./TypeTransformer";
import * as util from "util";

export class Type implements PcoreValue {
  readonly typeString : string;

  constructor(typeString : string) {
    this.typeString = toPcoreType(typeString);
  }

  [util.inspect.custom](depth, options) {
    return this.typeString;
  }

  __ptype(): string {
    return "Type";
  }

  __pvalue(): string {
    return this.typeString;
  }
}

export const anyType = new Type('Any');
