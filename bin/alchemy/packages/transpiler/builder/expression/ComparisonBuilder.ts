import { ExpressionNode } from '@alchemy/ast';
import { OperableBuilder, OperableChildren } from './OperableBuilder';
import { TokenMatcher } from '@intent/kernel';

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
