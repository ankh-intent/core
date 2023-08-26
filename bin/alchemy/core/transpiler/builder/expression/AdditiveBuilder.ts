import { TokenMatcher } from '@intent/parser';
import { ExpressionNode } from '../../ast';
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
