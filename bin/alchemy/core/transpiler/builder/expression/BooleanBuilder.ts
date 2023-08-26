import { ExpressionNode } from '../../ast';
import { OperableBuilder, OperableChildren } from './OperableBuilder';
import { TokenMatcher } from '@intent/parser';

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
