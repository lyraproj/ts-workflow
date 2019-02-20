import * as util from 'util';

import {StringHash, Value} from './Util';

export enum LogLevel {
  Debug = 'DEBUG',
  Info = 'INFO',
  Warning = 'WARNING',
  Error = 'ERROR'
}

export interface Logger {
  info(format: string, ...args: Value[]): void;
  warning(format: string, ...args: Value[]): void;
  debug(format: string, ...args: Value[]): void;
  error(format: string, ...args: Value[]): void;
}

export class LogEntry {
  readonly level: LogLevel;
  readonly message: string;
  readonly timestamp: number;
  readonly args: Value[];

  constructor(level: LogLevel, message: string, args: Value[]) {
    this.level = level;
    this.message = message;
    this.timestamp = Date.now();
    this.args = args;
  }

  formatArgs(): string {
    let s = '';
    const top = this.args.length;
    if (top > 0) {
      s += ': ';
      for (let i = 0; i + 1 < top; i += 2) {
        s += ' ';
        s += this.args[i];
        s += '=';
        s += util.inspect(this.args[i + 1]);
      }
    }
    return s;
  }

  toString() {
    return `[${this.level}] ${this.message}${this.formatArgs()}`;
  }

  toStringNL() {
    return `[${this.level}] ${this.message}${this.formatArgs()}\n`;
  }
}

export abstract class AbstractLogger implements Logger {
  readonly entries: LogEntry[] = new Array<LogEntry>();

  protected abstract log(entry: LogEntry): void;

  debug(format: string, ...args: Value[]) {
    this.log(new LogEntry(LogLevel.Debug, format, args));
  }

  error(format: string, ...args: Value[]) {
    this.log(new LogEntry(LogLevel.Error, format, args));
  }

  info(format: string, ...args: Value[]) {
    this.log(new LogEntry(LogLevel.Info, format, args));
  }

  warning(format: string, ...args: Value[]) {
    this.log(new LogEntry(LogLevel.Warning, format, args));
  }
}

export class ArrayLogger extends AbstractLogger {
  readonly entries: LogEntry[] = new Array<LogEntry>();

  protected log(entry: LogEntry) {
    this.entries.push(entry);
  }

  logEntries(): ReadonlyArray<LogEntry> {
    return this.entries;
  }
}

export class ConsoleLogger extends AbstractLogger {
  protected log(entry: LogEntry) {
    console.log(entry.toString());
  }
}

export class StreamLogger extends AbstractLogger {
  private readonly stream: NodeJS.WritableStream;

  constructor(stream: NodeJS.WritableStream) {
    super();
    this.stream = stream;
  }

  protected log(entry: LogEntry) {
    this.stream.write(entry.toStringNL());
  }
}

/**
 * Writes HCLog style JSON entries on stderr
 */
export class PluginLogger extends AbstractLogger {
  private readonly stream: NodeJS.WritableStream;

  constructor(stream: NodeJS.WritableStream = process.stderr) {
    super();
    this.stream = stream;
  }

  protected log(entry: LogEntry) {
    let ts = new Date(entry.timestamp).toISOString();
    ts = ts.substring(0, ts.length - 1) + '000+00:00';
    const hcEntry: StringHash = {'@message': entry.message, '@level': entry.level.valueOf(), '@timestamp': ts};
    const args = entry.args;
    const top = args.length;
    for (let i = 0; i + 1 < top; i += 2) {
      hcEntry[args[i] as string] = args[i + 1];
    }
    this.stream.write(JSON.stringify(hcEntry) + '\n');
  }
}

export let logger: AbstractLogger = new PluginLogger();

export function setDefaultLogger(dl: AbstractLogger) {
  logger = dl;
}
