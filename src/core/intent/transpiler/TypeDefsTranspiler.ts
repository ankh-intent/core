
import { AbstractCompoundTemplate } from '../../flow/transpiler/templates/CompoundTemplate';
import { Container } from '../../flow/transpiler/Container';
import { TypeDefNode } from "../ast/TypeDefNode";

export class TypeDefsTranspiler extends AbstractCompoundTemplate<Container<TypeDefNode>> {
  public get code(): string {
    return `{%*typedef%}`;
  }
}
