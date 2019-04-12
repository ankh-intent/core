
import { AbstractNode } from '../../../core/kernel/tree/AbstractNode';
import { QualifierNode } from './QualifierNode';

export class UseNode extends AbstractNode {
  public qualifier: QualifierNode;
  public alias: string;
}
