import { TokenMatcher } from '@intent/parser';
import { ExpressionNode, UnaryNode } from '@alchemy/ast';
import { OperableBuilder, OperableChildren } from './OperableBuilder';

export type MultiplicativeChildren = OperableChildren & {
    unary: UnaryNode;
};

const CMP = ['*', '/', '%', '**'];

export class MultiplicativeBuilder extends OperableBuilder<MultiplicativeChildren> {
    operands = CMP;

    protected buildBase(tokens: TokenMatcher): ExpressionNode {
        return this.child.unary(tokens);
    }
}
