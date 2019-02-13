import * as ts from 'typescript';
import { StringHash } from '../pcore/Util';
export declare class TranspiledResult {
    readonly program: ts.Program;
    readonly inferredTypes: StringHash;
    constructor(program: ts.Program, inferredTypes: StringHash);
}
/**
 * extractTypeInfo transpiles a manifest in order to extract type information of
 * input arguments and actions and resources.
 * @param sources
 * @param options
 */
export declare function extractTypeInfo(sources: string[], options?: ts.CompilerOptions): TranspiledResult;
