import { AbstractNode } from '@intent/kernel';

import { FunctorNode } from '../functor';
import { DomainInterfaceNode } from './interface';
import { TypeNode } from '../reference';
import { UsesNode } from '../use';

export class DomainNode extends AbstractNode {
  constructor(
    public identifier: string,
    public parent: TypeNode|null,
    public intf: DomainInterfaceNode,
    public uses: UsesNode,
    public domains: Map<string, DomainNode> = new Map(),
    public methods: Map<string, FunctorNode> = new Map(),
    public ctor: FunctorNode|null = null,
  ) {
    super();
  }
}
