import { TranslationContext } from '@intent/translator';
import { CallArg } from '@alchemy/modules';
import { CallArgNode, ExpressionNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../../AlchemyNodeTranslator';

export type CallArgTranslatorChildren = {
    expression: ExpressionNode;
};

export class CallArgTranslator extends AlchemyNodeTranslator<CallArg, CallArgTranslatorChildren> {
    translate(node: CallArgNode, context: TranslationContext<any>): CallArg {
        return CallArg.create(node, context.parent, {
            identifier: node.identifier,
            expression: this.child.expression(node.expression, context),
        });
    }
}
