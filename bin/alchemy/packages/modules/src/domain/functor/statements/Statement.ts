import { Translated } from '@intent/translator';
import { StatementNode } from '@alchemy/ast';

export class Statement<N extends StatementNode = StatementNode> extends Translated<N> {
    get isAssertion() {
        return true;
    }

    toString() {
        return `statement`;
    }
}
