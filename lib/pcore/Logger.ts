import {vsprintf} from 'sprintf-js';

import {Value} from './Util';

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
  readonly format: string;
  readonly args: Value[];

  constructor(level: LogLevel, format: string, args: Value[]) {
    this.level = level;
    this.format = format;
    this.args = args;
  }

  toString() {
    return `${this.level}: ${vsprintf(this.format, this.args)}`;
  }

  toStringNL() {
    return `${this.level}: ${vsprintf(this.format, this.args)}\n`;
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
