import { DomainNode } from './DomainNode';
import { ExpressionNode } from './expression/ExpressionNode';
import { InterfaceNode } from './interface/InterfaceNode';
import { QualifierNode } from './QualifierNode';
import { TypeNode } from './TypeNode';
import { UsesNode } from './UsesNode';

export class EnumNode extends DomainNode {
  constructor(
    public identifier: string,
    public parent: TypeNode|null,
    public values: Map<QualifierNode, ExpressionNode> = new Map(),
  ) {
    super(identifier, parent, new InterfaceNode(), new UsesNode());
  }
}
