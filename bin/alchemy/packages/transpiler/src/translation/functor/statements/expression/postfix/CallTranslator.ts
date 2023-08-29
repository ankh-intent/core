import { TranslationContext } from '@intent/translator';
import { Call, CallArgs } from '@alchemy/modules';
import { CallNode, CallArgNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../../AlchemyNodeTranslator';

export type CallTranslatorChildren = {
    call_arg: CallArgNode;
};

export class CallTranslator extends AlchemyNodeTranslator<Call, CallTranslatorChildren> {
    translate(node: CallNode, context: TranslationContext<any>): Call {
        return Call.create(node, context.parentNode, (call: Call) => ({
            right: CallArgs.create(node.right, call, {
                args: node.right.args.map((arg) => this.child.call_arg(arg, context)),
            }),
        }));
    }
}
