/// <reference types="jest" />

import {toPcoreType} from "../build/src/pcore/TypeTransformer";

describe('toPcoreType', () => {
  it('should convert number to Float', () => {
    expect(toPcoreType('number')).toBe('Float');
  });

  it('should convert string to String', () => {
    expect(toPcoreType('string')).toBe('String');
  });

  it('should convert boolean to Boolean', () => {
    expect(toPcoreType('boolean')).toBe('Boolean');
  });

  it('should convert any to Any', () => {
    expect(toPcoreType('any')).toBe('Any');
  });

  it('should convert object to Hash', () => {
    expect(toPcoreType('object')).toBe('Hash');
  });

  it('should convert {} to Hash', () => {
    expect(toPcoreType('{}')).toBe('Hash');
  });

  it('should convert string to String', () => {
    expect(toPcoreType('string')).toBe('String');
  });

  it('should convert string to String', () => {
    expect(toPcoreType('string')).toBe('String');
  });

  it('should convert Array<string> to Array[String]', () => {
    expect(toPcoreType('Array<string>')).toBe('Array[String]');
  });

  it('should convert string[] to Array[String]', () => {
    expect(toPcoreType('string[]')).toBe('Array[String]');
  });

  it('should convert string[number, string] to Tuple[Float,String]', () => {
    expect(toPcoreType('[number, string]')).toBe('Tuple[Float,String]');
  });

  it('should convert string[number, string?] to Tuple[Float,String,1,2]', () => {
    expect(toPcoreType('[number, string?]')).toBe('Tuple[Float,String,1,2]');
  });

  it('should convert {[s: string ]: number} to Hash[String,Number]', () => {
    expect(toPcoreType('{[s: string ]: number}')).toBe('Hash[String,Float]');
  });

  it("should convert 'one'|'two'|'three' to Enum['one','two','three']", () => {
    expect(toPcoreType("'one'|'two'|'three'")).toBe("Enum['one','two','three']");
  });

  it("should convert 'one'|'two'|Array<'one'|'two'> to Variant[Enum['one','two'],Array[Enum['one','two']]]", () => {
    expect(toPcoreType("'one'|'two'|Array<'one'|'two'>")).toBe("Variant[Enum['one','two'],Array[Enum['one','two']]]");
  });
});
