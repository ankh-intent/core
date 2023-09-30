import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { ReferenceNode, ExpressionNode, DomainInterfacePropertyNode, DecoratedStatementNode } from '@alchemy/ast';
import { BaseBuilder } from '../../BaseBuilder';

export type DomainInterfacePropertyChildren = {
    maybe_type: ReferenceNode;
    type: ReferenceNode;
    expression: ExpressionNode;
}

export class InterfacePropertyBuilder extends BaseBuilder<DomainInterfacePropertyNode, DomainInterfacePropertyChildren> {
    protected build(tokens: TokenMatcher, { get, ensure, peek }: TypedTokenMatcherInterface) {
        const decorator: ExpressionNode | null = get.symbol('@') ? this.child.expression(tokens) : null;

        const identifier = ensure.identifier();
        const optional = !!get.symbol('?');
        const type: ReferenceNode | null = get.symbol(':')
            ? (optional ? this.child.maybe_type(tokens) : this.child.type(tokens))
            : null;
        const expression: ExpressionNode | null = (get.symbol('=') || peek.symbol('('))
            ? this.child.expression(tokens)
            : null;

        return new DomainInterfacePropertyNode(
            identifier,
            decorator,
            expression,
            type,
        );
    }
}
