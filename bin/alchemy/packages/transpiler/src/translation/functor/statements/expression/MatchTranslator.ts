import { TranslationContext } from '@intent/translator';

import { Match } from '@alchemy/modules';
import { ExpressionNode, MatchNode, MatchStatementNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../AlchemyNodeTranslator';

export type MatchTranslatorChildren = {
    expression: ExpressionNode;
    match_statement: MatchStatementNode;
};

export class MatchTranslator extends AlchemyNodeTranslator<Match, MatchTranslatorChildren> {
    translate(node: MatchNode, context: TranslationContext<any>): Match {
        return Match.create(node, context.parentNode, {
            expression: this.child.expression(node.expression, context),
            statements: node.statements.map((statement) => this.child.match_statement(statement, context)),
        });
    }
}
