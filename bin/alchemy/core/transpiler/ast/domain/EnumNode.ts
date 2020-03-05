import { ExpressionNode } from '../expression';
import { QualifierNode, TypeNode, GenericTemplatesNode } from '../reference';
import { UsesNode } from '../use';
import { DomainNode } from './DomainNode';
import { DomainInterfaceNode } from './interface';

export class EnumNode extends DomainNode {
  constructor(
    identifier: string,
    parent: TypeNode|null,
    public values: Map<QualifierNode, ExpressionNode> = new Map(),
  ) {
    super(identifier, new GenericTemplatesNode(), parent, new DomainInterfaceNode(), new UsesNode());
  }
}
