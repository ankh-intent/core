import { TypedTokenMatcherInterface } from '@intent/parser';

import { ReferenceNode, ExpressionNode, DomainInterfacePropertyNode } from '../../../ast';
import { BaseBuilder } from '../../BaseBuilder';

export type DomainInterfacePropertyChildren = {
    type: ReferenceNode;
    expression: ExpressionNode;
}

export class InterfacePropertyBuilder extends BaseBuilder<DomainInterfacePropertyNode, DomainInterfacePropertyChildren> {
    protected build(tokens, { not, get, ensure, peek }: TypedTokenMatcherInterface) {
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
