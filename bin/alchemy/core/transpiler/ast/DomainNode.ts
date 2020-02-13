import { AbstractNode } from '@intent/kernel/ast';

import { FunctorNode } from './functor';
import { InterfaceNode } from './interface';
import { TypeNode } from './TypeNode';
import { UsesNode } from './UsesNode';

export class DomainNode extends AbstractNode {
  constructor(
    public identifier: string,
    public parent: TypeNode|null,
    public intf: InterfaceNode,
    public uses: UsesNode,
    public domains: Map<string, DomainNode> = new Map(),
    public ctor: FunctorNode|null = null,
  ) {
    super();
  }
}
