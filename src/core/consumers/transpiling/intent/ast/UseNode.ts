
import { AbstractNode } from '../../../ast-compiling/tree/AbstractNode';
import { QualifierNode } from './QualifierNode';

export class UseNode extends AbstractNode {
  public qualifier: QualifierNode;
  public alias: string;
}
