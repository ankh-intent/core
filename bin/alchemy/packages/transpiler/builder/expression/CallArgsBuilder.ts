import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/parser';

import { CallArgsNode, CallArgNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type CallArgsChildren = {
    call_arg: CallArgNode;
};

export class CallArgsBuilder extends BaseBuilder<CallArgsNode, CallArgsChildren> {
    protected build(tokens: TokenMatcher, { not, peek }: TypedTokenMatcherInterface) {
        const args: CallArgNode[] = [];

        while (!peek.symbol(')')) {
            args.push(this.child.call_arg(tokens));

            if (not.symbol(',')) {
                break;
            }
        }

        return new CallArgsNode(
            args,
        );
    }
}
