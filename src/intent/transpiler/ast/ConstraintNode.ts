
import { AbstractNode } from '../../../core/consumers/ast-compiling/tree/AbstractNode';
import { CanNode } from './CanNode';

export class ConstraintNode extends AbstractNode {
  can: CanNode;
}
