
import { AbstractCompoundTemplate } from '../../flow/transpiler/templates/CompoundTemplate';
import { Container } from '../../flow/transpiler/Container';
import { TypeNode } from '../ast/TypeNode';

export class TypesTranspiler extends AbstractCompoundTemplate<Container<TypeNode>> {
  public get code(): string {
    return `{%*type%}`;
  }
}
