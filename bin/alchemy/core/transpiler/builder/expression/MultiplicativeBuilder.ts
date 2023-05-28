import { ExpressionNode, UnaryNode } from '../../ast';
import { OperableBuilder, OperableChildren } from './OperableBuilder';

export type MultiplicativeChildren = OperableChildren & {
    unary: UnaryNode;
};

const CMP = ['*', '/', '%', '**'];

export class MultiplicativeBuilder extends OperableBuilder<MultiplicativeChildren> {
    operands = CMP;

    protected buildBase(tokens): ExpressionNode {
        return this.child.unary(tokens);
    }
}
