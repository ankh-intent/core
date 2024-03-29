import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { FunctorArgsNode, FunctorArgNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type FunctorArgsChildren = {
    functor_arg: FunctorArgNode;
}

export class FunctorArgsBuilder extends BaseBuilder<FunctorArgsNode, FunctorArgsChildren> {
    protected build(tokens: TokenMatcher, { peek, not }: TypedTokenMatcherInterface) {
        const args: FunctorArgNode[] = [];

        while (!peek.symbol(')')) {
            const arg = this.child.functor_arg(tokens);

            if (arg.name && args.find((a) => a.name === arg.name)) {
                throw tokens.error(
                    `Argument with the same name "${arg.name}" already present`,
                    'Error in functor declaration'
                );
            }

            args.push(arg);

            if (peek.symbol(',')) {
                this.setFunctor(tokens);
            }

            if (not.symbol(',')) {
                break;
            }
        }

        this.setFunctor(tokens);

        return new FunctorArgsNode(
            args,
        );
    }
}
