import { CallArg } from '../../../../../../../modules';
import { CallArgNode, ExpressionNode } from '../../../../../../ast';
import { NodeTranslator } from '../../../../../NodeTranslator';
import { TranslationContext } from '../../../../../TranslationContext';

export type CallArgTranslatorChildren = {
    expression: ExpressionNode;
};

export class CallArgTranslator extends NodeTranslator<CallArg, CallArgTranslatorChildren> {
    translate(node: CallArgNode, context: TranslationContext<any>): CallArg {
        return CallArg.create(node, context.parent, {
            identifier: node.identifier,
            expression: this.child.expression(node.expression, context),
        });
    }
}
