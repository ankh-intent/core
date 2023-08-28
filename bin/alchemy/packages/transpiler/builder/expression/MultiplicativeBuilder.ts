import { TokenMatcher } from '@intent/kernel';
import { ExpressionNode, UnaryNode } from '@alchemy/ast';
import { OperableBuilder, OperableChildren } from './OperableBuilder';

export type MultiplicativeChildren = OperableChildren & {
    numerative: ExpressionNode;
};

const CMP = ['*', '/', '%', '**'];

export class MultiplicativeBuilder extends OperableBuilder<MultiplicativeChildren> {
    operands = CMP;

    protected buildBase(tokens: TokenMatcher): ExpressionNode {
        return this.child.numerative(tokens);
    }
}
