import { AbstractNode } from '@intent/kernel/ast';

import { PropertyNode } from './PropertyNode';
import { TypeNode } from './TypeNode';

export class CanNode extends AbstractNode {
  public name: string;
  public args: {[name: string]: PropertyNode};
  public returns: TypeNode | null;
  public body: string;
}
