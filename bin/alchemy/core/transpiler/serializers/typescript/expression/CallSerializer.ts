import { CallNode, CallArgNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface CallSerializerChildren {
  call_arg: CallArgNode;
}

export class CallSerializer extends NodeSerializer<CallNode, CallSerializerChildren> {
  serialize(node: CallNode): string {
    return `(${this.wrapInlineList(node.right.args.map(this.child.call_arg))})`;
  }
}
