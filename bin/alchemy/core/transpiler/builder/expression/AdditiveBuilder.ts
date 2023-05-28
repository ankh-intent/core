import { ExpressionNode } from '../../ast';
import { OperableBuilder, OperableChildren } from './OperableBuilder';

export type AdditiveChildren = OperableChildren & {
    multiplicative: ExpressionNode;
};

const CMP = ['+', '-'];

export class AdditiveBuilder extends OperableBuilder<AdditiveChildren> {
    operands = CMP;

    protected buildBase(tokens): ExpressionNode {
        return this.child.multiplicative(tokens);
    }
}
