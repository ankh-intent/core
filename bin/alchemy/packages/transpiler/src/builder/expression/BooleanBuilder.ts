import { TokenMatcher } from '@intent/kernel';
import { ExpressionNode } from '@alchemy/ast';
import { OperableBuilder, OperableChildren } from './OperableBuilder';

export type BooleanChildren = OperableChildren & {
    comparison: ExpressionNode;
};

export class BooleanBuilder extends OperableBuilder<BooleanChildren> {
    operands = ['&&', '||', '^^'];

    protected buildBase(tokens: TokenMatcher): ExpressionNode {
        return this.child.comparison(tokens);
    }
}
