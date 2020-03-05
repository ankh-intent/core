import { AbstractNode } from '@intent/kernel';

import { IdentifierNode } from '../expression';
import { TypeNode } from './TypeNode';

export class GenericTemplateNode extends AbstractNode {
  public constructor(
    public identifier: IdentifierNode,
    public parent: TypeNode | null,
    public def: TypeNode | null,
  ) {
    super();
  }
}
