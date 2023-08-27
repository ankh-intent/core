import { TranslationContext } from '@intent/translator';
import { IfStatement } from '@alchemy/modules';
import {
    IfStatementNode,
    BlockNode,
    StatementNode,
} from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../AlchemyNodeTranslator';

export type IfStatementTranslatorChildren = {
    block: BlockNode;
    statement: StatementNode;
};

export class IfStatementTranslator extends AlchemyNodeTranslator<IfStatement, IfStatementTranslatorChildren> {
    translate(node: IfStatementNode, context: TranslationContext<any>): IfStatement {
        return IfStatement.create(node, context.parent, {
            condition: this.child.statement(node.condition, context),
            ifTrue: this.child.block(node.ifTrue, context),
            ifFalse: node.ifFalse && this.child.block(node.ifFalse, context),
        });
    }
}
