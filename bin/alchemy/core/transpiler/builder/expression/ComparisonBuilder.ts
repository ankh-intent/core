import { ExpressionNode } from '../../ast';
import { OperableBuilder, OperableChildren } from './OperableBuilder';
import { TokenMatcher } from '@intent/parser';

export type ComparisonChildren = OperableChildren & {
    additive: ExpressionNode;
};

const CMP = ['>', '<', '>=', '<=', '!=', '=='];

export class ComparisonBuilder extends OperableBuilder<ComparisonChildren> {
    operands = CMP;

    protected buildBase(tokens: TokenMatcher): ExpressionNode {
        return this.child.additive(tokens);
    }
}
