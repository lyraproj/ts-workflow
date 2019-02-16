declare module 'source-map-resolve' {
  import {PathLike} from 'fs';

  interface  SourceMap {
    file: string;
    mappings: string[];
    sources: string[];
    names: string[];
  }

  interface  MapData {
    map: SourceMap;
    url: string;
    sourcesRelativeTo: string;
    sourceMappingURL: string;
  }

  function resolveSourceMapSync(
    code: string,
    codeUrl: string,
    readFileSync: (
      path: PathLike|number,
      options?: {encoding?: null; flag?: string;}|null) => Buffer) : null|MapData;
}
