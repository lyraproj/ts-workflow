import * as ts from 'typescript';

/**
 * Transform the string representation of a TypeScript type definition into
 * a string representation of its corresponding Pcore type.
 * @param tsType - String representation of the TypeScript type to convert
 * @returns String representation of the resulting Puppet type.
 */
export function toPcoreType(tsType: string): string {
  return transformType(parseType(tsType));
}

function transformTypeName(typeName: string): string {
  switch (typeName) {
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
    case 'Date':
      return 'Timestamp';
    case 'RegExp':
      return 'Regexp';
    case 'Uint8Array':
      return 'Binary';
    default:
      return typeName;
  }
}

function parseType(t: string): ts.TypeNode|undefined {
  const fn = '/parameter/type.ts';
  const sf = ts.createSourceFile(fn, 'var x:' + t + ';', ts.ScriptTarget.ES2018, true);
  const diag = ts.createProgram([fn], {}).getSyntacticDiagnostics(sf);
  if (diag.length > 0) {
    throw new Error(`'${t}' is not a valid type definition`);
  }
  return (sf.statements[0] as ts.VariableStatement).declarationList.declarations[0].type;
}

function typeTransformationError(t: ts.TypeNode): Error {
  return new Error('unable to convert type \'' + t.getFullText() + '\'');
}

/**
 * Converts a type reference in the form Array<string> to Array[String]
 * @param tr
 */
function transformTypeReference(tr: ts.TypeReferenceNode): string {
  const args = tr.typeArguments;
  let name = transformTypeName(tr.typeName.getText());
  if (args !== undefined && args.length > 0) {
    name += '[';
    let first = true;
    args.forEach((arg) => {
      if (first) {
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
 * Converts a type literal in the form <code>{ x: string, y: number }</code>
 * into <code>Struct['x' => String, 'y' => Float]</code> and <code>{ [s:
 * string]: boolean }</code> into <code>Hash[String,Boolean]</code>.
 * @param tl
 */
function transformTypeLiteral(tl: ts.TypeLiteralNode): string {
  const args = tl.members;
  if (args.length === 0) {
    return 'Hash';
  }

  if (args.length === 1) {
    const arg = args[0];
    if (ts.isIndexSignatureDeclaration(arg)) {
      const pn = (arg as ts.IndexSignatureDeclaration);
      const params = pn.parameters;
      if (params.length === 1) {
        // This is a hash declaration.
        return 'Hash[' + transformType(params[0].type) + ',' + transformType(pn.type) + ']';
      }
      throw typeTransformationError(tl);
    }
  }

  if (!ts.isPropertySignature(args[0])) {
    throw typeTransformationError(tl);
  }

  let name = 'Struct[';
  for (let i = 0; i < args.length; i++) {
    const ps = args[i] as ts.PropertySignature;
    if (i > 0) {
      name += ',';
    }
    if (ps.questionToken === undefined) {
      name += '\'' + ps.name.getText() + '\' => ';
    } else {
      name += 'Optional[\'' + ps.name.getText() + '\'] => ';
    }
    name += transformType(ps.type);
  }
  return name + ']';
}

/**
 * Converts a tuple in the form <code>[string, number]</code> into
 * <code>Tuple[String, Float]</code>. Optional and captures rest are both
 * handled so <code>[string, boolean?, ...number]</code> becomes
 * <code>Tuple[String,Boolean,Float,1]</code> and <code>[string, boolean?,
 * number?] becomes <code>Tuple[String,Boolean,Float,1,3]</code>.
 * @param tn
 */
function transformTupleType(tn: ts.TupleTypeNode): string {
  const args = tn.elementTypes;
  let name = 'Tuple[';
  let min = -1;
  let rest = false;
  for (let i = 0; i < args.length; i++) {
    if (i > 0) {
      name += ',';
    }
    let arg = args[i];
    switch (arg.kind) {
      case ts.SyntaxKind.OptionalType:
        arg = (arg as ts.OptionalTypeNode).type;
        if (min < 0) {
          min = i;
        }
        break;
      case ts.SyntaxKind.RestType:
        if (min < 0) {
          min = i;
        }
        arg = (arg as ts.RestTypeNode).type;
        rest = true;
        break;
      default:
        if (min >= 0) {
          throw new Error('required type cannot follow optional in tuple');
        }
    }
    name += transformType(arg);
  }
  if (min >= 0) {
    name += ',';
    name += min;
    if (!rest) {
      name += ',';
      name += args.length;
    }
  }
  return name + ']';
}

/**
 * Converts a union in the form <code>string | number</code> into
 * <code>Variant[String, Float]</code>
 * @param ut
 */
function transformUnionType(ut: ts.UnionTypeNode): string {
  // Union of string literals is an Enum
  const strings: string[] = [];
  const others: ts.TypeNode[] = [];

  ut.types.forEach(t => {
    if (ts.isLiteralTypeNode(t)) {
      const lt = t as ts.LiteralTypeNode;
      if (ts.isStringLiteral(lt.literal)) {
        strings.push((lt.literal as ts.LiteralExpression).text);
        return;
      }
    }
    others.push(t);
  });

  if (others.length > 0) {
    let name = 'Variant[';
    let first = true;
    if (strings.length > 0) {
      name += transformEnum(strings);
      first = false;
    }
    others.forEach(t => {
      if (first) {
        first = false;
      } else {
        name += ',';
      }
      name += transformType(t);
    });
    return name + ']';
  }
  return transformEnum(strings);
}

function transformEnum(enums: string[]): string {
  let name = 'Enum[';
  for (let i = 0; i < enums.length; i++) {
    if (i > 0) {
      name += ',';
    }
    name += '\'' + enums[i] + '\'';
  }
  name += ']';
  return name;
}


function transformLiteralType(lt: ts.LiteralTypeNode): string {
  if (ts.isStringLiteral(lt.literal)) {
    const expr = lt.literal as ts.LiteralExpression;
    if (expr.kind === ts.SyntaxKind.StringLiteral) {
      return 'Enum[\'' + expr.text + '\']';
    }
  }
  throw typeTransformationError(lt);
}

/**
 * Transform a ts.TypeNode into a string representation of a Puppet Type
 * Definition.
 * @param t
 */
function transformType(t: ts.TypeNode|undefined): string {
  if (t === undefined) {
    return 'Any';
  }

  if (ts.isArrayTypeNode(t)) {
    return 'Array[' + transformType((t as ts.ArrayTypeNode).elementType) + ']';
  }

  if (ts.isTypeReferenceNode(t)) {
    return transformTypeReference(t as ts.TypeReferenceNode);
  }

  if (ts.isTypeLiteralNode(t)) {
    return transformTypeLiteral(t as ts.TypeLiteralNode);
  }

  if (ts.isTupleTypeNode(t)) {
    return transformTupleType(t as ts.TupleTypeNode);
  }

  if (ts.isUnionTypeNode(t)) {
    return transformUnionType((t as ts.UnionTypeNode));
  }

  if (ts.isLiteralTypeNode(t)) {
    return transformLiteralType(t as ts.LiteralTypeNode);
  }

  const tn = ts.tokenToString(t.kind);
  if (tn === undefined) {
    throw typeTransformationError(t);
  }
  return transformTypeName(tn);
}
