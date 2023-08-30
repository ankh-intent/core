import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';
import { ExpressionNode, UnaryNode, CallNode, OperationNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type UnaryChildren = {
    assignable: ExpressionNode;
    call: CallNode;
};

const OPS = ['+', '-', '++', '--', '!'];
const INC = ['++', '--'];
const COM = ['typeof', 'with'];

export class UnaryBuilder extends BaseBuilder<ExpressionNode, UnaryChildren> {
    protected build(tokens: TokenMatcher, { peek, ensure }: TypedTokenMatcherInterface) {
        const operators: string[] = [];
        let pre: string | undefined = undefined;
        let post: string | undefined = undefined;
        let token: string | null;

        while ((token = peek.symbol()) && OPS.includes(token)) {
            operators.push(ensure.symbol());
        }

        if ((token = peek.identifier()) && COM.includes(token)) {
            operators.push(ensure.identifier());
        }

        if ((token = peek.symbol()) && INC.includes(token)) {
            pre = ensure.symbol();
        }

        const node = this.child.assignable(tokens);

        if ((token = peek.symbol()) && INC.includes(token)) {
            post = ensure.symbol();
        }

        let unary = !(pre || post || operators.length) ? node : new UnaryNode(
            node,
            operators,
            pre,
            post
        );

        let calls: OperationNode[] = [];

        while (peek.symbol('(')) {
            calls.push(this.child.call(tokens));
        }

        if (calls.length) {
            return new ExpressionNode(unary, calls);
        }

        return unary;
    }
}
