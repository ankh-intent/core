import { AbstractNode } from '@intent/kernel/ast';

import { DomainNode } from './domain/DomainNode';
import { UsesNode } from './use/UsesNode';

export class ModuleNode extends AbstractNode {
  public identifier: string;

  constructor(
    public uses: UsesNode,
    public domain: DomainNode,
  ) {
    super();
  }
}
