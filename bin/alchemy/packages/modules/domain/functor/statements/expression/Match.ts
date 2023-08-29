import { Strings } from '@intent/kernel';
import { Translated } from '@intent/translator';
import { ExpressionNode, MatchNode } from '@alchemy/ast';

import { MatchStatement } from './MatchStatement';

export class Match extends Translated<MatchNode> {
    public expression: ExpressionNode;
    public statements: MatchStatement[] = [];

    toString() {
        return `match (${this.expression}) => {\n${
            Strings.indent(this.statements.join('\n').split('\n'), '  ').join('\n')
        }\n}`;
    }
}
