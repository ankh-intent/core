import { AbstractNode } from '@intent/kernel';

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
