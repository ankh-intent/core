import { AbstractNode } from '@intent/kernel/ast';

import { DomainInterfacePropertyNode } from './DomainInterfacePropertyNode';

export class DomainInterfaceNode extends AbstractNode {
  constructor(
    public properties: Map<string, DomainInterfacePropertyNode> = new Map(),
  ) {
    super();
  }
}
