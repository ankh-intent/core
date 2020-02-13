import { BinaryOperationNode } from './BinaryOperationNode';
import { CallArgsNode } from './CallArgsNode';

export class CallNode extends BinaryOperationNode {
  constructor(args: CallArgsNode) {
    super('(', args);
  }
}
