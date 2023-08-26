import { IfStatement } from '@alchemy/modules';
import {
    IfStatementNode,
    BlockNode,
    StatementNode,
} from '@alchemy/ast';
import { NodeTranslator } from '../../../NodeTranslator';
import { TranslationContext } from '../../../TranslationContext';

export type IfStatementTranslatorChildren = {
    block: BlockNode;
    statement: StatementNode;
};

export class IfStatementTranslator extends NodeTranslator<IfStatement, IfStatementTranslatorChildren> {
    translate(node: IfStatementNode, context: TranslationContext<any>): IfStatement {
        return IfStatement.create(node, context.parent, {
            condition: this.child.statement(node.condition, context),
            ifTrue: this.child.block(node.ifTrue, context),
            ifFalse: node.ifFalse && this.child.block(node.ifFalse, context),
        });
    }
}
