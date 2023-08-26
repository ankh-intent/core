import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/parser';

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

            tokens.mark('IS_FUNCTOR');

            if (arg.name && args.find((a) => a.name === arg.name)) {
                throw tokens.error(
                    `Argument with the same name "${arg.name}" already present`,
                    'Error in functor declaration'
                );
            }

            args.push(arg);

            if (not.symbol(',')) {
                break;
            }
        }

        return new FunctorArgsNode(
            args,
        );
    }
}
