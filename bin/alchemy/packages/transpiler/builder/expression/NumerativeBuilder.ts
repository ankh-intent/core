import { TokenMatcher } from '@intent/kernel';
import { ExpressionNode } from '@alchemy/ast';
import { OperableBuilder, OperableChildren } from './OperableBuilder';

export type NumerativeChildren = OperableChildren & {
    applicative: ExpressionNode;
};

const CMP = ['&', '|', '^', '>>', '<<'];

export class NumerativeBuilder extends OperableBuilder<NumerativeChildren> {
    operands = CMP;

    protected buildBase(tokens: TokenMatcher): ExpressionNode {
        return this.child.applicative(tokens);
    }
}
