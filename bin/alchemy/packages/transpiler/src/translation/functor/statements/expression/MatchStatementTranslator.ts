import { TranslationContext } from '@intent/translator';

import { MatchStatement } from '@alchemy/modules';
import { ExpressionNode, MatchStatementNode, BlockNode, DereferenceNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../AlchemyNodeTranslator';

export type MatchStatementTranslatorChildren = {
    expression: ExpressionNode;
    dereference: DereferenceNode;
    block: BlockNode;
};

export class MatchStatementTranslator extends AlchemyNodeTranslator<MatchStatement, MatchStatementTranslatorChildren> {
    translate(node: MatchStatementNode<BlockNode>, context: TranslationContext<any>): MatchStatement {
        return MatchStatement.create(node, context.parentNode, {
            body: this.child.block(node.body, context),
            expression: node.expression && this.child.expression(node.expression, context),
            destructor: node.destruct && this.child.dereference(node.destruct, context),
        });
    }
}
