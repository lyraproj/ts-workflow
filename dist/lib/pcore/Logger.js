"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sprintf_js_1 = require("sprintf-js");
var LogLevel;
(function (LogLevel) {
    LogLevel["Debug"] = "DEBUG";
    LogLevel["Info"] = "INFO";
    LogLevel["Warning"] = "WARNING";
    LogLevel["Error"] = "ERROR";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
class LogEntry {
    constructor(level, format, args) {
        this.level = level;
        this.format = format;
        this.args = args;
    }
    toString() {
        return `${this.level}: ${sprintf_js_1.vsprintf(this.format, this.args)}`;
    }
    toStringNL() {
        return `${this.level}: ${sprintf_js_1.vsprintf(this.format, this.args)}\n`;
    }
}
exports.LogEntry = LogEntry;
class AbstractLogger {
    constructor() {
        this.entries = new Array();
    }
    debug(format, ...args) {
        this.log(new LogEntry(LogLevel.Debug, format, args));
    }
    error(format, ...args) {
        this.log(new LogEntry(LogLevel.Error, format, args));
    }
    info(format, ...args) {
        this.log(new LogEntry(LogLevel.Info, format, args));
    }
    warning(format, ...args) {
        this.log(new LogEntry(LogLevel.Warning, format, args));
    }
}
exports.AbstractLogger = AbstractLogger;
class ArrayLogger extends AbstractLogger {
    constructor() {
        super(...arguments);
        this.entries = new Array();
    }
    log(entry) {
        this.entries.push(entry);
    }
    logEntries() {
        return this.entries;
    }
}
exports.ArrayLogger = ArrayLogger;
class ConsoleLogger extends AbstractLogger {
    log(entry) {
        console.log(entry.toString());
    }
}
exports.ConsoleLogger = ConsoleLogger;
class StreamLogger extends AbstractLogger {
    constructor(stream) {
        super();
        this.stream = stream;
    }
    log(entry) {
        this.stream.write(entry.toStringNL());
    }
}
exports.StreamLogger = StreamLogger;
//# sourceMappingURL=Logger.js.map