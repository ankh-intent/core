import { ExpressionNode } from '@alchemy/ast';
import { OperableBuilder, OperableChildren } from './OperableBuilder';
import { TokenMatcher } from '@intent/kernel';

export type BooleanChildren = OperableChildren & {
    comparison: ExpressionNode;
};

const CMP = ['&', '|', '^'];

export class BooleanBuilder extends OperableBuilder<BooleanChildren> {
    operands = CMP;

    protected buildBase(tokens: TokenMatcher): ExpressionNode {
        return this.child.comparison(tokens);
    }
}
