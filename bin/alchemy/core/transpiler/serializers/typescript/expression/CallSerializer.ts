import { CallNode, CallArgNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type CallSerializerChildren = {
    call_arg: CallArgNode;
};

export class CallSerializer extends NodeSerializer<CallNode, CallSerializerChildren> {
    serialize(node: CallNode, context: SerializingContext): string {
        return `(${this.wrapInlineList(node.right.args.map((arg) => this.child.call_arg(arg, context)))})`;
    }
}
