import { AbstractNode } from '@intent/kernel/ast';
import { FunctorArgsNode } from './FunctorArgsNode';

import { TypeNode } from '../reference/TypeNode';
import { FunctorBodyNode } from './FunctorBodyNode';

export class FunctorNode extends AbstractNode {
  public constructor(
    public args: FunctorArgsNode,
    public returns: TypeNode | null,
    public body: FunctorBodyNode,
  ) {
    super();
  }
}
