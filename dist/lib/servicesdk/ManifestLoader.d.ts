import { Service } from './Service';
import { Definition } from './ServiceBuilder';
export declare class ManifestLoader {
    private readonly service?;
    constructor(service?: Service);
    loadManifest(fileName: string): Definition;
    private static mung;
}
