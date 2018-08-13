import * as ts from "typescript";

function parseType(t : string) : ts.TypeNode {
  let fn = '/parameter/type.ts';
  let sf = ts.createSourceFile(fn, 'var x:' + t + ';', ts.ScriptTarget.ES2018, true);
  let diag = ts.createProgram([fn], {}).getSyntacticDiagnostics(sf);
  if(diag.length > 0) {
    throw new Error(`'${t}' is not a valid type definition`);
  }
  return (<ts.VariableStatement>sf.statements[0]).declarationList.declarations[0].type;
}

function transformTypeName(typeName: string) : string {
  switch(typeName) {
  case 'string':
    return 'String';
  case 'any':
    return 'Any';
  case 'object':
    return 'Hash';
  case 'number':
  case 'Number':
  case 'Decimal':
    return 'Float';
  case 'boolean':
    return 'Boolean';
  case 'integer':
  case 'bigint':
    return 'Integer';
  default:
    return typeName;
  }
}

function typeTransformationError(t : ts.TypeNode) : never {
  throw new Error("unable to convert type '" + t.getFullText() + "'");
}

/**
 * Converts a type reference in the form Array<string> to Array[String]
 * @param tr
 */
function transformTypeReference(tr : ts.TypeReferenceNode) : string {
  let args = tr.typeArguments;
  let name = transformTypeName(tr.typeName.getText());
  if(args !== undefined && args.length > 0) {
    name += '[';
    let first = true;
    args.forEach((arg) => {
      if(first) {
        first = false;
      } else {
        name += ',';
      }
      name += transformType(arg);
    });
    name += ']';
  }
  return name;
}

/**
 * Converts a type literal in the form <code>{ x: string, y: number }</code> into
 * <code>Struct['x' => String, 'y' => Float]</code> and <code>{ [s: string]: boolean }</code> into
 * <code>Hash[String,Boolean]</code>.
 * @param tl
 */
function transformTypeLiteral(tl : ts.TypeLiteralNode) : string {
  let args = tl.members;
  switch(args.length) {
  case 0:
    return 'Hash';
  case 1:
    let arg = args[0];
    if (ts.isIndexSignatureDeclaration(arg)) {
      let pn = (<ts.IndexSignatureDeclaration>arg);
      let params = pn.parameters;
      if (params.length == 1) {
        // This is a hash declaration.
        return 'Hash[' + transformType(params[0].type) + ',' + transformType(pn.type) + ']';
      }
      typeTransformationError(tl);
    }
    // Fall through to default
  default:
    if(!ts.isPropertySignature(args[0])) {
      typeTransformationError(tl);
    }
    let name = 'Struct[';
    for(let i = 0; i < args.length; i++) {
      let ps = <ts.PropertySignature>args[i];
      if(i > 0) {
        name += ',';
      }
      if(ps.questionToken === undefined) {
        name += "'" + ps.name.getText() + "' => "
      } else {
        name += "Optional['" + ps.name.getText() + "'] => "
      }
      name += transformType(ps.type);
    }
    return name + ']';
  }
}

/**
 * Converts a tuple in the form <code>[string, number]</code> into <code>Tuple[String, Float]</code>. Optional
 * and captures rest are both handled so <code>[string, boolean?, ...number]</code> becomes
 * <code>Tuple[String,Boolean,Float,1]</code> and <code>[string, boolean?, number?] becomes
 * <code>Tuple[String,Boolean,Float,1,3]</code>.
 * @param tn
 */
function transformTupleType(tn : ts.TupleTypeNode) : string {
  let args = tn.elementTypes;
  let name = 'Tuple[';
  let min = -1;
  let rest = false;
  for(let i = 0; i < args.length; i++) {
    if(i > 0) {
      name += ',';
    }
    let arg = args[i];
    switch(arg.kind) {
    case ts.SyntaxKind.OptionalType:
      arg = (<ts.OptionalTypeNode>arg).type;
      if(min < 0) {
        min = i;
      }
      break;
    case ts.SyntaxKind.RestType:
      if(min < 0) {
        min = i;
      }
      arg = (<ts.RestTypeNode>arg).type;
      rest = true;
      break;
    default:
      if(min >= 0) {
        throw new Error("required type cannot follow optional in tuple")
      }
    }
    name += transformType(arg);
  }
  if(min >= 0) {
    name += ',';
    name += min;
    if(!rest) {
      name += ',';
      name += args.length;
    }
  }
  return name + ']';
}

/**
 * Converts a union in the form <code>string | number</code> into <code>Variant[String, Float]</code>
 * @param ut
 */
function transformUnionType(ut : ts.UnionTypeNode) : string {
  // Union of string literals is an Enum
  let types = ut.types;
  let count = types.length;
  let strings : string[] = [];
  let others : ts.TypeNode[] = [];

  for(let i = 0; i < count; i++) {
    let t = types[i];
    if(ts.isLiteralTypeNode(t)) {
      let lt = <ts.LiteralTypeNode>t;
      if(ts.isStringLiteral(lt.literal)) {
        strings.push((<ts.LiteralExpression>lt.literal).text);
        continue;
      }
    }
    others.push(t);
  }

  if(others.length > 0) {
    let name = 'Variant[';
    let first = true;
    if(strings.length > 0) {
      name += transformEnum(strings);
      first = false;
    }
    for(let i = 0; i < count; i++) {
      if(first) {
        first = false;
      } else {
        name += ',';
      }
      name += transformType(types[i]);
    }
    return name + ']';
  }
  return transformEnum(strings);
}

function transformEnum(enums : string[]) : string {
  let name = 'Enum[';
  for(let i = 0; i < enums.length; i++) {
    if(i > 0) {
      name += ',';
    }
    name += "'" + enums[i] + "'";
  }
  name += ']';
  return name;
}


function transformLiteralType(lt: ts.LiteralTypeNode) : string {
  if(ts.isStringLiteral(lt.literal)) {
    let expr = <ts.LiteralExpression>lt.literal;
    if(expr.kind == ts.SyntaxKind.StringLiteral) {
      return "Enum['" + expr.text + "']";
    }
  }
  typeTransformationError(lt);
}

/**
 * Transform a ts.TypeNode into a string representation of a Puppet Type Definition.
 * @param t
 */
function transformType(t : ts.TypeNode) : string {
  if(ts.isArrayTypeNode(t)) {
    return 'Array[' + transformType((<ts.ArrayTypeNode>t).elementType) + ']';
  }

  if(ts.isTypeReferenceNode(t)) {
    return transformTypeReference(<ts.TypeReferenceNode>t);
  }

  if (ts.isTypeLiteralNode(t)) {
    return transformTypeLiteral(<ts.TypeLiteralNode>t);
  }

  if(ts.isTupleTypeNode(t)) {
    return transformTupleType(<ts.TupleTypeNode>t);
  }

  if(ts.isUnionTypeNode(t)) {
    return transformUnionType((<ts.UnionTypeNode>t));
  }

  if(ts.isLiteralTypeNode(t)) {
    return transformLiteralType(<ts.LiteralTypeNode>t);
  }

  let tn = ts.tokenToString(t.kind);
  if(tn === undefined) {
    typeTransformationError(t);
  }
  return transformTypeName(tn);
}

/**
 * Transform the string representation of a TypeScript type definition into
 * a string representation of its corresponding Puppet type.
 * @param tsType - String representation of the TypeScript type to convert
 * @returns String representation of the resulting Puppet type.
 */
export function toPuppetType(tsType : string) : string {
  return transformType(parseType(tsType));
}
