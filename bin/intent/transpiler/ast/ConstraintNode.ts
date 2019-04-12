import { AbstractNode } from '@intent/kernel/ast/AbstractNode';

import { CanNode } from './CanNode';

export class ConstraintNode extends AbstractNode {
  can: CanNode;
}
