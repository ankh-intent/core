import { AbstractNode } from '@intent/kernel/ast';

import { DomainNode } from './DomainNode';
import { UsesNode } from './UsesNode';

export class ModuleNode extends AbstractNode {
  public identifier: string;

  constructor(
    public uses: UsesNode,
    public domain: DomainNode,
  ) {
    super();
  }
}
