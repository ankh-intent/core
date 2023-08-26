import { ReturnStatement } from '../../../../../modules';
import { ReturnStatementNode, ExpressionNode } from '../../../../ast';
import { NodeTranslator } from '../../../NodeTranslator';
import { TranslationContext } from '../../../TranslationContext';

export type ReturnStatementTranslatorChildren = {
    expression: ExpressionNode;
};

export class ReturnStatementTranslator extends NodeTranslator<ReturnStatement, ReturnStatementTranslatorChildren> {
    translate(node: ReturnStatementNode, context: TranslationContext<any>): ReturnStatement {
        return ReturnStatement.create(node, context.parent, {
            expression: node.expression && this.child.expression(node.expression, context),
        });
    }
}
