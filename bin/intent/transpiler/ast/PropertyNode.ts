import { AbstractNode } from '~kernel/ast/AbstractNode';

import { TypeNode } from './TypeNode';

export class PropertyNode extends AbstractNode {
  public name: string;
  public type: TypeNode;
}
