/// <reference types="jest" />
import {PcoreObject, PcoreValue, Serializer} from "../lib/pcore/Serializer";
import {Context} from "../lib/pcore/Context";
import {ArrayLogger, setDefaultLogger} from "../lib/pcore/Logger";
import {MemCollector} from "../lib/pcore/Collector";
import {StringHash} from "../lib/pcore/Util";
import {Namespace, TypedName} from "../lib/pcore/TypedName";
import {Parameter} from "../lib/pcore/Parameter";
import {Deferred} from "../lib/pcore/Deferred";

setDefaultLogger(new ArrayLogger());

export namespace My {
  export class Thing {
    constructor(public message: string) {}

    what() {
      return this.message;
    }
  }

  export namespace Own {
    export class Thing {
      constructor(public message: string) {}

      what() {
        return this.message;
      }
    }

    export class Item implements PcoreObject {
      private message : string;

      constructor({message} : {message: string}) {
        this.message = message;
      }

      what() {
        return this.message;
      }

      __ptype() : string {
        return 'Some::Item';
      }
    }
  }


  export class Stuff implements PcoreValue {
    private message : string;

    constructor({x} : {x: string}) {
      this.message = x;
    }

    what() {
      return this.message;
    }

    __ptype() : string {
      return 'Some::Stuff';
    }

    __pvalue() : StringHash {
      return { x: this.message };
    }
  }
}

const glob = { My };

describe('Serializer', () => {
  it('streams a regexp', () => {
    const obj = /foo.*bar/;
    const ctx = new Context(glob);
    const collector = new MemCollector();
    const ser = new Serializer(ctx, {});
    ser.convert(obj, collector);

    const createdObj = collector.value();
    const expectedObj = new Map(Object.entries({__ptype: 'Regexp', __pvalue: 'foo.*bar'}));
    expect(createdObj).toEqual(expectedObj);
  });

  it('streams a Timestamp', () => {
    const obj = new Date("2019-02-04T02:13:20.1234Z");
    const ctx = new Context(glob);
    const collector = new MemCollector();
    const ser = new Serializer(ctx, {});
    ser.convert(obj, collector);

    const createdObj = collector.value();
    const expectedObj = new Map(Object.entries({__ptype: 'Timestamp', __pvalue: '2019-02-04T02:13:20.123Z'}));
    expect(createdObj).toEqual(expectedObj);
  });

  it('streams a TypedName', () => {
    const obj = new TypedName(Namespace.NsService, 'a::service::name');
    const ctx = new Context(glob);
    const collector = new MemCollector();
    const ser = new Serializer(ctx, {});
    ser.convert(obj, collector);

    const createdObj = collector.value();
    const expectedObj = new Map(Object.entries({
      __ptype: 'TypedName',
      name: 'a::service::name',
      namespace: 'service'
    }));
    expect(createdObj).toEqual(expectedObj);
  });

  it('streams a Parameter', () => {
    const obj = new Parameter('x', 'Date', new Deferred('lookup', 'some.stuff'));
    const ctx = new Context(glob);
    const collector = new MemCollector();
    const ser = new Serializer(ctx, {});
    ser.convert(obj, collector);

    const createdObj = collector.value();
    const expectedObj = new Map(Object.entries({
      __ptype: 'Lyra::Parameter',
      name: 'x',
      type: new Map(Object.entries({
        __ptype: 'Type',
        __pvalue: 'Timestamp'
      })),
      value: new Map(Object.entries({
        __ptype: 'Deferred',
        name: 'lookup',
        arguments: ['some.stuff']
      }))
    }));
    expect(createdObj).toEqual(expectedObj);
  });

  it('streams a data hash', () => {
    const obj = new My.Own.Thing('Hello world');
    const ctx = new Context(glob);
    const collector = new MemCollector();
    const ser = new Serializer(ctx, {});
    ser.convert(obj, collector);

    const createdObj = collector.value();
    const expectedObj = new Map(Object.entries({__ptype: 'My::Own::Thing', message: 'Hello world'}));
    expect(createdObj).toEqual(expectedObj);
  });

  it('streams a __ptype property', () => {
    const obj = new My.Own.Item({message: 'Hello world'});
    const ctx = new Context(glob);
    const collector = new MemCollector();
    const ser = new Serializer(ctx, {});
    ser.convert(obj, collector);

    const createdObj = collector.value();
    const expectedObj = new Map(Object.entries({__ptype: 'Some::Item', message: 'Hello world'}));
    expect(createdObj).toEqual(expectedObj);
  });

  it('streams a __pvalue property', () => {
    const obj = new My.Stuff({x: 'Hello world'});
    const ctx = new Context(glob);
    const collector = new MemCollector();
    const ser = new Serializer(ctx, {});
    ser.convert(obj, collector);

    const createdObj = collector.value();
    const expectedObj = new Map(Object.entries({__ptype: 'Some::Stuff', x: 'Hello world'}));
    expect(createdObj).toEqual(expectedObj);
  });
});
