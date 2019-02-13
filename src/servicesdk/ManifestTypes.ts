import * as ts from "typescript";
import {NotNull, StringHash} from "../pcore/Util";

const defaultCompilerOptions : ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2018,
  module: ts.ModuleKind.CommonJS,
};

export class TranspiledResult {
  readonly program : ts.Program;
  readonly inferredTypes : StringHash;

  constructor(program : ts.Program, inferredTypes : StringHash) {
    this.program = program;
    this.inferredTypes = inferredTypes;
  }
}

/**
 * extractTypeInfo transpiles a manifest in order to extract type information of input arguments and
 * actions and resources.
 * @param sources
 * @param options
 */
export function extractTypeInfo(sources : string[], options : ts.CompilerOptions = {}) : TranspiledResult {
  for(const [k, v] of Object.entries(defaultCompilerOptions)) {
    if(options[k] === undefined) {
      options[k] = v;
    }
  }
  const program = ts.createProgram(sources, options);
  const checker = program.getTypeChecker();
  const collector = {};
  const path = new Array<string>();

  const collect = (name : string, value : NotNull) => {
    let leaf = collector;
    path.forEach((p) => {
      let b = leaf[p];
      if(b === undefined) {
        b = {};
        leaf[p] = b;
      }
      leaf = b;
    });
    leaf[name] = value;
  };

  const expectKind = <T extends ts.Node>(n : ts.Node, okFunc : (n : ts.Node) => n is T, expected : string) : T => {
    if(!okFunc(n)) {
      throw new Error(`expected node of ${expected} type. Got kind: ${n.kind}`);
    }
    return n;
  };

  const expectHash = (na : ts.NodeArray<ts.Expression>) : ts.ObjectLiteralExpression => {
    if(na.length === 1) {
      return expectKind(na[0], ts.isObjectLiteralExpression, 'object literal');
    }
    throw new Error(`expected exactly one parameter of type object literal`);
  };

  const traverseProperties = (o : ts.ObjectLiteralExpression, tf : (pa : ts.PropertyAssignment) => void) => {
    o.properties.forEach((p) => tf(expectKind(p, ts.isPropertyAssignment, 'property assignment')));
  };

  const traverseActionReturn = (o : ts.Node) => {
    const ht = expectKind(o, ts.isTypeLiteralNode, 'literal hash type');
    const params = {};
    for(const m of ht.members) {
      if(ts.isPropertySignature(m)) {
        params[m.name.getText()] = m.type === undefined ? 'any' : m.type.getText();
      }
    }
    collect('output', params);
  };

  const traversePtypeBody = (n : ts.Node) => {
    // Extract the string literal from __ptype function
    //
    // __ptype() : string {
    //   return "Some::Type::Name";
    // }
    if(ts.isStringLiteral(n)) {
      collect('type', n.text);
    } else {
      ts.forEachChild(n, traversePtypeBody);
    }
  };

  const traverseObjectType = (o : ts.Node) => {
    // Find the __ptype() function and traverse its body
    if(ts.isMethodDeclaration(o)) {
      if(o.name.getText() === '__ptype' && o.body !== undefined) {
        traversePtypeBody(o.body);
      }
    } else {
      ts.forEachChild(o, traverseObjectType);
    }
  };

  // Traverses the action hash
  const traverseActionProperty = (pa: ts.PropertyAssignment) => {
    if(pa.name.getText() === 'do' && ts.isFunctionLike(pa.initializer)) {
      // Infer type information about input and state type
      const f = (pa.initializer as ts.FunctionLikeDeclaration);

      // The type of the initializer must be the type of the state itself.
      // Let the checker find out what type that is so that we can extract
      // the actual type from its __ptype() function
      checker.getTypeAtLocation(f).getCallSignatures().forEach((s) => {
        s.getReturnType().symbol.declarations.forEach(traverseActionReturn);
      });

      // Extract the parameter types. Those are the types for the resource input variables
      const params = {};
      f.parameters.forEach((p) => {
        params[p.name.getText()] = p.type === undefined ? 'any' : p.type.getText();
      });
      collect('input', params);

      // Return type of do function must be a map,
    }
  };

  // Traverses the resource hash
  const traverseResourceProperty = (pa: ts.PropertyAssignment) => {
    if(pa.name.getText() === 'state' && ts.isFunctionLike(pa.initializer)) {
      // Infer type information about input and state type
      const f = (pa.initializer as ts.FunctionLikeDeclaration);

      // The type of the initializer must be the type of the state itself.
      // Let the checker find out what type that is so that we can extract
      // the actual type from its __ptype() function
      checker.getTypeAtLocation(f).getCallSignatures().forEach((s) => {
        s.getReturnType().symbol.declarations.forEach(traverseObjectType);
      });

      // Extract the parameter types. Those are the types for the resource input variables
      const params = {};
      f.parameters.forEach((p) => {
        params[p.name.getText()] = p.type === undefined ? 'any' : p.type.getText();
      });
      collect('input', params);
    }
  };

  // Traverses the workflow hash
  const traverseWorkflowProperty = (n : ts.PropertyAssignment) => {
    if(n.name.getText() !== 'activities') {
      return;
    }

    const o = expectKind(n.initializer, ts.isObjectLiteralExpression, 'object literal');
    o.properties.forEach((p) => {
      const pa = expectKind(p, ts.isPropertyAssignment, 'property assignment');
      const f = expectKind(pa.initializer, ts.isCallExpression, 'call');
      const c = f.expression;
      if(ts.isIdentifier(c)) {
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

  const traverseAction = (o : ts.ObjectLiteralExpression) => traverseProperties(o, traverseActionProperty);
  const traverseWorkflow = (o : ts.ObjectLiteralExpression) => traverseProperties(o, traverseWorkflowProperty);
  const traverseResource = (o : ts.ObjectLiteralExpression) => traverseProperties(o, traverseResourceProperty);

  const traverse = (o : ts.Node) => {
    switch(o.kind) {
    case ts.SyntaxKind.CallExpression:
      const f = (o as ts.CallExpression);
      const c = f.expression;
      if(ts.isIdentifier(c)) {
        const key = (c as ts.Identifier).text;
        switch (key) {
        case 'resource':
          traverseResource(expectHash(f.arguments));
          return;
        case 'action':
          traverseAction(expectHash(f.arguments));
          return;
        case 'workflow':
          traverseWorkflow(expectHash(f.arguments));
          return;
        }
      }
    }
    ts.forEachChild(o, traverse);
  };

  for(const n of sources) {
    const sf = program.getSourceFile(n);
    if(sf !== undefined) {
      ts.forEachChild(sf, traverse);
    }
  }

  return new TranspiledResult(program, collector);
}
