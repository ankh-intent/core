import { CallNode, CallArgNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export type CallSerializerChildren = {
    call_arg: CallArgNode;
};

export class CallSerializer extends NodeSerializer<CallNode, CallSerializerChildren> {
    serialize(node: CallNode, context): string {
        return `(${this.wrapInlineList(node.right.args.map((arg) => this.child.call_arg(arg, context)))})`;
    }
}
