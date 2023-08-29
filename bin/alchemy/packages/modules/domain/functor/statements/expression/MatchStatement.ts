import { Translated } from '@intent/translator';
import { MatchStatementNode, BlockNode } from '@alchemy/ast';
import { Block } from '../Block';
import { Expression } from './Expression';
import { Dereference } from './spread';

export class MatchStatement extends Translated<MatchStatementNode<BlockNode>> {
    public body: Block;
    public expression?: Expression;
    public destructor?: Dereference;

    toString() {
        const expression = this.expression ? `case (${this.expression || 'true'}) ` : '';
        const destructor = this.destructor ? `match ${this.destructor}` : '';

        return `${expression}${String(destructor).split('\n').map((line) => line.trim()).join(' ')}${(expression || destructor) ? ': ' : 'else '}${this.body}}`;
    }
}
