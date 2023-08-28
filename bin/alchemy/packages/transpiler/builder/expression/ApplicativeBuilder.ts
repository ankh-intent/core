import { TokenMatcher, TypedTokenMatcherInterface } from '@intent/kernel';
import { ExpressionNode, UnaryNode, OperationNode, IsDomainNode } from '@alchemy/ast';
import { OperableBuilder, OperableChildren } from './OperableBuilder';

export type ApplicativeChildren = OperableChildren & {
    unary: UnaryNode;
    is_domain: IsDomainNode;
};

export class ApplicativeBuilder extends OperableBuilder<ApplicativeChildren> {
    protected buildBase(tokens: TokenMatcher): ExpressionNode {
        return this.child.unary(tokens);
    }

    protected consumeOperation(tokens: TokenMatcher, { peek }: TypedTokenMatcherInterface): OperationNode | undefined | null {
        if (peek.identifier('is')) {
            return this.child.is_domain(tokens);
        }
    }
}
