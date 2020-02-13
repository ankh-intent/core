import { DomainNode } from './DomainNode';
import { ExpressionNode } from '../expression/ExpressionNode';
import { DomainInterfaceNode } from './interface/DomainInterfaceNode';
import { QualifierNode } from '../reference/QualifierNode';
import { TypeNode } from '../reference/TypeNode';
import { UsesNode } from '../use/UsesNode';

export class EnumNode extends DomainNode {
  constructor(
    public identifier: string,
    public parent: TypeNode|null,
    public values: Map<QualifierNode, ExpressionNode> = new Map(),
  ) {
    super(identifier, parent, new DomainInterfaceNode(), new UsesNode());
  }
}
