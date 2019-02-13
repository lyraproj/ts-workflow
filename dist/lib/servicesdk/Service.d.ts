import { TypedName } from '../pcore/TypedName';
export declare class Service {
    readonly serviceId: TypedName;
    readonly callables: {
        [s: string]: object;
    };
    private readonly server;
    private readonly startPort;
    private readonly endPort;
    private readonly context;
    private readonly definitions;
    private static getAvailablePort;
    private static toData;
    private static fromData;
    constructor(nsBase: {}, serviceId: TypedName, startPort: number, endPort: number);
    start(): void;
}
