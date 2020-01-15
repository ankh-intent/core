import { AbstractNode } from '@intent/kernel/ast';

import { TypeDefNode } from './TypeDefNode';
import { UseNode } from './UseNode';

export class DomainNode extends AbstractNode {
  public identifier: string;
  public types: {[name: string]: TypeDefNode};
  public uses: {[name: string]: UseNode};
}
