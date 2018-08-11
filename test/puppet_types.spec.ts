/// <reference types="jest" />
import { toPuppetType } from "../src/puppet_types";

describe('toPuppetType', () => {
  it('should convert number to Float', () => {
    expect(toPuppetType('number')).toBe('Float');
  });

  it('should convert string to String', () => {
    expect(toPuppetType('string')).toBe('String');
  });

  it('should convert boolean to Boolean', () => {
    expect(toPuppetType('boolean')).toBe('Boolean');
  });

  it('should convert any to Any', () => {
    expect(toPuppetType('any')).toBe('Any');
  });

  it('should convert object to Hash', () => {
    expect(toPuppetType('object')).toBe('Hash');
  });

  it('should convert {} to Hash', () => {
    expect(toPuppetType('{}')).toBe('Hash');
  });

  it('should convert string to String', () => {
    expect(toPuppetType('string')).toBe('String');
  });

  it('should convert string to String', () => {
    expect(toPuppetType('string')).toBe('String');
  });

  it('should convert Array<string> to Array[String]', () => {
    expect(toPuppetType('Array<string>')).toBe('Array[String]');
  });

  it('should convert string[] to Array[String]', () => {
    expect(toPuppetType('string[]')).toBe('Array[String]');
  });

  it('should convert string[number, string] to Tuple[Float,String]', () => {
    expect(toPuppetType('[number, string]')).toBe('Tuple[Float,String]');
  });

  it('should convert string[number, string?] to Tuple[Float,String,1,2]', () => {
    expect(toPuppetType('[number, string?]')).toBe('Tuple[Float,String,1,2]');
  });

  it('should convert {[s: string ]: number} to Hash[String,Number]', () => {
    expect(toPuppetType('{[s: string ]: number}')).toBe('Hash[String,Float]');
  });
});
