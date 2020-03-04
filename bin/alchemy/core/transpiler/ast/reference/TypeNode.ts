import { AbstractNode } from '@intent/kernel';

import { QualifierNode } from './QualifierNode';
import { TypeGenericNode } from './TypeGenericNode';

export class TypeNode extends AbstractNode {
  public constructor(
    public qualifier: QualifierNode,
    public generic: TypeGenericNode<TypeNode>|null,
    public isArray: boolean = false,
  ) {
    super();
  }
}
