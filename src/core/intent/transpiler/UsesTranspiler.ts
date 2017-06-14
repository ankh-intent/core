
import { AbstractCompoundTemplate } from '../../flow/transpiler/templates/CompoundTemplate';
import { Container } from '../../flow/transpiler/Container';
import { UseNode } from '../ast/UseNode';

export class UsesTranspiler extends AbstractCompoundTemplate<Container<UseNode>> {
  public get code(): string {
    return `let {%.alias%} = {} // {%use%}`;
  }
}
