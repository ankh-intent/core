import { Call, CallArgs } from '../../../../../../../modules';
import { CallNode, CallArgNode } from '../../../../../../ast';
import { NodeTranslator } from '../../../../../NodeTranslator';

export type CallTranslatorChildren = {
    call_arg: CallArgNode;
};

export class CallTranslator extends NodeTranslator<Call, CallTranslatorChildren> {
    translate(node: CallNode, c): Call {
        return Call.create(node, c.parent, (call) => ({
            right: CallArgs.create(node.right, call, {
                args: node.right.args.map((arg) => this.child.call_arg(arg, c)),
            }),
        }));
    }
}
