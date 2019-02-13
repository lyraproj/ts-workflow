import { Value } from './Util';
export declare enum LogLevel {
    Debug = "DEBUG",
    Info = "INFO",
    Warning = "WARNING",
    Error = "ERROR"
}
export interface Logger {
    info(format: string, ...args: Value[]): any;
    warning(format: string, ...args: Value[]): any;
    debug(format: string, ...args: Value[]): any;
    error(format: string, ...args: Value[]): any;
}
export declare class LogEntry {
    readonly level: LogLevel;
    readonly format: string;
    readonly args: Value[];
    constructor(level: LogLevel, format: string, args: Value[]);
    toString(): string;
    toStringNL(): string;
}
export declare abstract class AbstractLogger implements Logger {
    readonly entries: LogEntry[];
    protected abstract log(entry: LogEntry): any;
    debug(format: string, ...args: Value[]): void;
    error(format: string, ...args: Value[]): void;
    info(format: string, ...args: Value[]): void;
    warning(format: string, ...args: Value[]): void;
}
export declare class ArrayLogger extends AbstractLogger {
    readonly entries: LogEntry[];
    protected log(entry: LogEntry): void;
    logEntries(): ReadonlyArray<LogEntry>;
}
export declare class ConsoleLogger extends AbstractLogger {
    protected log(entry: LogEntry): void;
}
export declare class StreamLogger extends AbstractLogger {
    private readonly stream;
    constructor(stream: NodeJS.WritableStream);
    protected log(entry: LogEntry): void;
}
