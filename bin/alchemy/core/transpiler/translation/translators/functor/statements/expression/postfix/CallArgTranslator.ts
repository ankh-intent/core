import { CallArg } from '../../../../../../../modules';
import { CallArgNode, ExpressionNode } from '../../../../../../ast';
import { NodeTranslator } from '../../../../../NodeTranslator';

export type CallArgTranslatorChildren = {
    expression: ExpressionNode;
};

export class CallArgTranslator extends NodeTranslator<CallArg, CallArgTranslatorChildren> {
    translate(node: CallArgNode, c): CallArg {
        return CallArg.create(node, c.parent, {
            identifier: node.identifier,
            expression: this.child.expression(node.expression, c),
        });
    }
}
