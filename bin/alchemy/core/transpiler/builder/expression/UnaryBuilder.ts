import { TypedTokenMatcherInterface } from '@intent/parser';
import { ExpressionNode, UnaryNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type UnaryChildren = {
    accessor: ExpressionNode;
};

const OPS = ['+', '-', '++', '--', '!'];
const COM = ['typeof'];

export class UnaryBuilder extends BaseBuilder<ExpressionNode, UnaryChildren> {
    protected build(tokens, { peek, ensure }: TypedTokenMatcherInterface) {
        let symbol = peek.symbol();

        if (symbol && OPS.includes(symbol)) {
            return new UnaryNode(
                ensure.symbol(),
                this.child.accessor(tokens),
            );
        }

        let command = peek.identifier();

        if (command && COM.includes(command)) {
            return new UnaryNode(
                ensure.identifier(),
                this.child.accessor(tokens),
            );
        }

        return this.child.accessor(tokens);
    }
}
