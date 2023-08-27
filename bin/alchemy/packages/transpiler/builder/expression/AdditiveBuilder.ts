import { TokenMatcher } from '@intent/kernel';
import { ExpressionNode } from '@alchemy/ast';
import { OperableBuilder, OperableChildren } from './OperableBuilder';

export type AdditiveChildren = OperableChildren & {
    multiplicative: ExpressionNode;
};

const CMP = ['+', '-'];

export class AdditiveBuilder extends OperableBuilder<AdditiveChildren> {
    operands = CMP;

    protected buildBase(tokens: TokenMatcher): ExpressionNode {
        return this.child.multiplicative(tokens);
    }
}
