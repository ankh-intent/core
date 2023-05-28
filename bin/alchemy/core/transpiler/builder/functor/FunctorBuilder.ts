import { TypedTokenMatcherInterface } from '@intent/parser';

import { FunctorNode, ReferenceNode, FunctorArgsNode, FunctorBodyNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type FunctorChildren = {
    type: ReferenceNode;
    functor_args: FunctorArgsNode;
    functor_body: FunctorBodyNode;
}

export class FunctorBuilder extends BaseBuilder<FunctorNode, FunctorChildren> {
    protected build(tokens, { get, ensure }: TypedTokenMatcherInterface) {
        ensure.symbol('(');

        const args = this.child.functor_args(tokens);

        ensure.symbol(')');

        tokens.mark('IS_FUNCTOR');

        const returns = get.symbol(':') ? this.child.type(tokens) : null;

        ensure.symbol('=>');

        const body = this.child.functor_body(tokens);

        return new FunctorNode(
            args,
            returns,
            body,
        );
    }
}
