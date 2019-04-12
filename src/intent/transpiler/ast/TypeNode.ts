
import { AbstractNode } from '../../../core/consumers/ast-compiling/tree/AbstractNode';
import { QualifierNode } from './QualifierNode';

export class TypeNode extends AbstractNode {
  public qualifier: QualifierNode;
  public generic: any;
}
