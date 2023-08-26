import { Call, CallArgs } from '@alchemy/modules';
import { CallNode, CallArgNode } from '@alchemy/ast';
import { NodeTranslator } from '../../../../../NodeTranslator';
import { TranslationContext } from '../../../../../TranslationContext';

export type CallTranslatorChildren = {
    call_arg: CallArgNode;
};

export class CallTranslator extends NodeTranslator<Call, CallTranslatorChildren> {
    translate(node: CallNode, context: TranslationContext<any>): Call {
        return Call.create(node, context.parent, (call: Call) => ({
            right: CallArgs.create(node.right, call, {
                args: node.right.args.map((arg) => this.child.call_arg(arg, context)),
            }),
        }));
    }
}
