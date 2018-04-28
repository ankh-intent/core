
import { AbstractNode } from '../../../ast-compiling/tree/AbstractNode';
import { CanNode } from './CanNode';

export class ConstraintNode extends AbstractNode {
  can: CanNode;
}
