import * as fs from 'fs';
import {readFileSync} from 'fs';
import * as sr from 'source-map-resolve';
import * as ts from 'typescript';
import {isIdentifier, isStringLiteral} from 'typescript';
import * as url from 'url';

import {NotNull, StringHash} from '../pcore/Util';

const defaultCompilerOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2018,
  module: ts.ModuleKind.CommonJS,
};

export class TranspiledResult {
  readonly program: ts.Program;
  readonly inferredTypes: StringHash;

  constructor(program: ts.Program, inferredTypes: StringHash) {
    this.program = program;
    this.inferredTypes = inferredTypes;
  }
}

export function extractTypeInfoByPath(fileName: string): StringHash|null {
  const src = readFileSync(fileName, {encoding: 'UTF-8'});
  if (src === null) {
    throw new Error('unable to read file \'${fileName}\'');
  }
  const sm = sr.resolveSourceMapSync(src, fileName, fs.readFileSync);
  return sm === null ? null :
                       extractTypeInfo(fileName, [url.resolve(sm.sourcesRelativeTo, sm.map.sources[0])]).inferredTypes;
}

/**
 * extractTypeInfo transpiles a manifest in order to extract type information of
 * input arguments and actions and resources.
 * @param fileName
 * @param sources
 * @param options
 */
export function extractTypeInfo(
    fileName: string, sources: string[], options: ts.CompilerOptions = {}): TranspiledResult {
  for (const [k, v] of Object.entries(defaultCompilerOptions)) {
    if (options[k] === undefined) {
      options[k] = v;
    }
  }
  const program = ts.createProgram(sources, options);
  const checker = program.getTypeChecker();
  const collector: StringHash = {};
  const path: string[] = [];

  const collect = (name: string, value: NotNull) => {
    let leaf = collector;
    path.forEach((p) => {
      let b = leaf[p];
      if (b === undefined) {
        b = {};
        leaf[p] = b;
      }
      leaf = b as StringHash;
    });
    leaf[name] = value;
  };

  const traverseActionReturn = (o: ts.Node) => {
    const ht = expectKind(o, ts.isTypeLiteralNode, 'literal hash type');
    const params: {[s: string]: string} = {};
    for (const m of ht.members) {
      if (ts.isPropertySignature(m)) {
        params[m.name.getText()] = m.type === undefined ? 'any' : m.type.getText();
      }
    }
    collect('output', params);
  };

  const traversePtypeBody = (n: ts.Node) => {
    // Extract the string literal from __ptype function
    //
    // __ptype() : string {
    //   return "Some::Type::Name";
    // }
    if (ts.isStringLiteral(n)) {
      collect('type', n.text);
    } else {
      ts.forEachChild(n, traversePtypeBody);
    }
  };

  const traverseObjectType = (o: ts.Node) => {
    // Find the __ptype() function and traverse its body
    if (ts.isMethodDeclaration(o)) {
      if (o.name.getText() === '__ptype' && o.body !== undefined) {
        traversePtypeBody(o.body);
      }
    } else {
      ts.forEachChild(o, traverseObjectType);
    }
  };

  // Traverses the action hash
  const traverseActionProperty = (pa: ts.PropertyAssignment) => {
    if (pa.name.getText() === 'do' && ts.isFunctionLike(pa.initializer)) {
      // Infer type information about input and state type
      const f = (pa.initializer as ts.FunctionLikeDeclaration);

      // The type of the initializer must be the type of the state itself.
      // Let the checker find out what type that is so that we can extract
      // the actual type from its __ptype() function
      checker.getTypeAtLocation(f).getCallSignatures().forEach((s) => {
        s.getReturnType().symbol.declarations.forEach(traverseActionReturn);
      });

      // Extract the parameter types. Those are the types for the resource input
      // variables
      const params: {[s: string]: string} = {};
      f.parameters.forEach((p) => {
        params[p.name.getText()] = p.type === undefined ? 'any' : p.type.getText();
      });
      collect('input', params);

      // Return type of do function must be a map,
    }
  };

  // Traverses the resource hash
  const traverseResourceProperty = (pa: ts.PropertyAssignment) => {
    if (pa.name.getText() === 'state' && ts.isFunctionLike(pa.initializer)) {
      // Infer type information about input and state type
      const f = (pa.initializer as ts.FunctionLikeDeclaration);

      // The type of the initializer must be the type of the state itself.
      // Let the checker find out what type that is so that we can extract
      // the actual type from its __ptype() function
      checker.getTypeAtLocation(f).getCallSignatures().forEach((s) => {
        s.getReturnType().symbol.declarations.forEach(traverseObjectType);
      });

      // Extract the parameter types. Those are the types for the resource input
      // variables
      const params: {[s: string]: string} = {};
      f.parameters.forEach((p) => {
        params[p.name.getText()] = p.type === undefined ? 'any' : p.type.getText();
      });
      collect('input', params);
    }
  };

  // Traverses the workflow hash
  const traverseWorkflowProperty = (n: ts.PropertyAssignment) => {
    if (n.name.getText() !== 'activities') {
      return;
    }

    const o = expectKind(n.initializer, ts.isObjectLiteralExpression, 'object literal');
    o.properties.forEach((p) => {
      const pa = expectKind(p, ts.isPropertyAssignment, 'property assignment');
      const f = expectKind(pa.initializer, ts.isCallExpression, 'call');
      const c = f.expression;
      if (ts.isIdentifier(c)) {
        const key = (c as ts.Identifier).text;
        switch (key) {
          case 'resource':
            path.push(pa.name.getText());
            traverseResource(expectHash(f.arguments));
            path.pop();
            break;
          case 'action':
            path.push(pa.name.getText());
            traverseAction(expectHash(f.arguments));
            path.pop();
            break;
          case 'workflow':
            path.push(pa.name.getText());
            traverseWorkflow(expectHash(f.arguments));
            path.pop();
            break;
        }
      }
    });
  };

  const traverseAction = (o: ts.ObjectLiteralExpression) => traverseProperties(o, traverseActionProperty);
  const traverseWorkflow = (o: ts.ObjectLiteralExpression) => traverseProperties(o, traverseWorkflowProperty);
  const traverseResource = (o: ts.ObjectLiteralExpression) => traverseProperties(o, traverseResourceProperty);

  const traverse = (o: ts.Node) => {
    if (ts.isObjectLiteralExpression(o) && hasSourceEntry(o)) {
      switch (getActivityStyle(o)) {
        case 'resource':
          traverseResource(o);
          return;
        case 'action':
          traverseAction(o);
          return;
        case 'workflow':
          traverseWorkflow(o);
          return;
      }
    }
    ts.forEachChild(o, traverse);
  };

  for (const n of sources) {
    const sf = program.getSourceFile(n);
    if (sf !== undefined) {
      ts.forEachChild(sf, traverse);
    }
  }

  return new TranspiledResult(program, collector);
}

function expectKind<T extends ts.Node>(n: ts.Node, okFunc: (n: ts.Node) => n is T, expected: string): T {
  if (!okFunc(n)) {
    throw new Error(`expected node of ${expected} type. Got kind: ${n.kind}`);
  }
  return n;
}

function expectHash(na: ReadonlyArray<ts.Expression>): ts.ObjectLiteralExpression {
  if (na.length === 1) {
    return expectKind(na[0], ts.isObjectLiteralExpression, 'object literal');
  }
  throw new Error(`expected exactly one parameter of type object literal`);
}

function traverseProperties(o: ts.ObjectLiteralExpression, tf: (pa: ts.PropertyAssignment) => void) {
  o.properties.forEach((p) => tf(expectKind(p, ts.isPropertyAssignment, 'property assignment')));
}

function hasSourceEntry(ol: ts.ObjectLiteralExpression): boolean {
  for (const p of ol.properties) {
    if (p.name !== undefined && (isIdentifier(p.name) || isStringLiteral(p.name)) && p.name.text === 'source' &&
        ts.isPropertyAssignment(p) && isIdentifier(p.initializer) && p.initializer.text === '__filename') {
      return true;
    }
  }
  return false;
}

function getActivityStyle(ol: ts.ObjectLiteralExpression): 'workflow'|'resource'|'action'|null {
  for (const p of ol.properties) {
    if (p.name !== undefined && (isIdentifier(p.name) || isStringLiteral(p.name))) {
      switch (p.name.text) {
        case 'activities':
          return 'workflow';
        case 'state':
          return 'resource';
        case 'do':
          return 'action';
      }
    }
  }
  return null;
}
