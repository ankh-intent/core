import { AbstractNode } from '@intent/kernel/ast';

import { FunctorNode } from './functor/FunctorNode';

export class CanNode extends AbstractNode {
  public name: string;
  public func: FunctorNode;
}
