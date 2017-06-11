
import { AbstractNode } from './AbstractNode';
import { QualifierNode } from './QualifierNode';

export class TypeNode extends AbstractNode {
  public qualifier: QualifierNode;
  public generic: any;
}
