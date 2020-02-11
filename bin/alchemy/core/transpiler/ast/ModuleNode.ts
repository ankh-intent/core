import { AbstractNode } from '@intent/kernel/ast';

import { DomainNode } from './DomainNode';
import { UseNode } from './UseNode';

export class ModuleNode extends AbstractNode {
  public identifier: string;
  public domain: DomainNode;
  public uses: {[name: string]: UseNode};
}
