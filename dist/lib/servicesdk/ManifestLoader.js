"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const fs_1 = require("fs");
const path_1 = require("path");
const requireFromString = require("require-from-string");
const sr = require("source-map-resolve");
const url = require("url");
const ManifestService_1 = require("./ManifestService");
const ManifestTypes_1 = require("./ManifestTypes");
const ServiceBuilder_1 = require("./ServiceBuilder");
class ManifestLoader {
    constructor(service) {
        this.service = service;
    }
    loadManifest(fileName) {
        const src = fs_1.readFileSync(fileName, { encoding: 'UTF-8' });
        if (src === null) {
            throw new Error('unable to read file \'${fileName}\'');
        }
        // Load the module and ensure that it exports an ActivityMap
        const ex = requireFromString(src, fileName);
        if (!ServiceBuilder_1.isActivityMap(ex)) {
            throw new Error('file \'${fileName}\' does not export an ActivityMap');
        }
        const sm = sr.resolveSourceMapSync(src, fileName, fs.readFileSync);
        console.log(url.resolve(sm.sourcesRelativeTo, sm.map.sources[0]));
        const tr = ManifestTypes_1.extractTypeInfo([url.resolve(sm.sourcesRelativeTo, sm.map.sources[0])]);
        const mf = ManifestLoader.mung(fileName);
        const sb = new ServiceBuilder_1.ServiceBuilder(mf);
        sb.fromMap(path_1.basename(fileName, '.js'), ex, tr.inferredTypes);
        if (this.service !== undefined) {
            this.service.callables[mf] = new ManifestService_1.ManifestService(sb);
        }
        return sb.definitions[0];
    }
    static mung(path) {
        let b = '';
        let pu = true;
        let ps = true;
        const top = path.length;
        for (let idx = 0; idx < top; ++idx) {
            let c = path.charAt(idx);
            if (c === '/') {
                if (!ps) {
                    b += '::';
                    ps = true;
                }
            }
            else if (c === '_' || c >= '0' && c <= '9' || c >= 'A' && c <= 'Z' || c >= 'a' && c <= 'z') {
                if (ps || pu) {
                    c = c.toUpperCase();
                }
                b += c;
                ps = false;
                pu = false;
            }
            else {
                pu = true;
            }
        }
        if (ps) {
            b = b.substring(0, b.length - 2);
        }
        return b;
    }
}
exports.ManifestLoader = ManifestLoader;
//# sourceMappingURL=ManifestLoader.js.map