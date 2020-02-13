import { AbstractNode } from '@intent/kernel/ast';

import { InterfacePropertyNode } from './InterfacePropertyNode';

export class InterfaceNode extends AbstractNode {
  constructor(
    public properties: Map<string, InterfacePropertyNode> = new Map(),
  ) {
    super();
  }
}
