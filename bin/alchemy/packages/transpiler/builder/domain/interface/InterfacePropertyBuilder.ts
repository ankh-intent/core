import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { ReferenceNode, ExpressionNode, DomainInterfacePropertyNode } from '@alchemy/ast';
import { BaseBuilder } from '../../BaseBuilder';

export type DomainInterfacePropertyChildren = {
    type: ReferenceNode;
    expression: ExpressionNode;
}

export class InterfacePropertyBuilder extends BaseBuilder<DomainInterfacePropertyNode, DomainInterfacePropertyChildren> {
    protected build(tokens: TokenMatcher, { get, ensure }: TypedTokenMatcherInterface) {
        const identifier = ensure.identifier();
        const type: ReferenceNode | null = get.symbol(':')
            ? this.child.type(tokens)
            : null;
        const expression: ExpressionNode | null = get.symbol('=')
            ? this.child.expression(tokens)
            : null;

        return new DomainInterfacePropertyNode(
            identifier,
            expression,
            type,
        );
    }
}
