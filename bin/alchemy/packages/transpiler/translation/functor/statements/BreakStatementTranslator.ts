import { TranslationContext } from '@intent/translator';
import { BreakStatement } from '@alchemy/modules';
import { BreakStatementNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../AlchemyNodeTranslator';

export type BreakStatementTranslatorChildren = {};

export class BreakStatementTranslator extends AlchemyNodeTranslator<BreakStatement, BreakStatementTranslatorChildren> {
    translate(node: BreakStatementNode, context: TranslationContext<any>): BreakStatement {
        return BreakStatement.create(node, context.parent, {
            type: node.type,
        });
    }
}
