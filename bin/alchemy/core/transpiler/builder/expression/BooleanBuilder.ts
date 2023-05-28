import { ExpressionNode } from '../../ast';
import { OperableBuilder, OperableChildren } from './OperableBuilder';

export type BooleanChildren = OperableChildren & {
    comparision: ExpressionNode;
};

const CMP = ['&', '|', '^'];

export class BooleanBuilder extends OperableBuilder<BooleanChildren> {
    operands = CMP;

    protected buildBase(tokens): ExpressionNode {
        return this.child.comparision(tokens);
    }
}
