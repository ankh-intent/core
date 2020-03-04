import { AbstractNode } from '@intent/kernel';
import { FunctorArgsNode } from './FunctorArgsNode';

import { TypeNode } from '../reference';
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
