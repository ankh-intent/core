import { AbstractNode } from '@intent/kernel/ast';

import { DomainNode } from './domain';
import { UsesNode } from './use';

export class ModuleNode extends AbstractNode {
  public identifier: string;

  constructor(
    public uses: UsesNode,
    public domain: DomainNode,
  ) {
    super();
  }
}
