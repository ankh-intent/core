import { BuilderInvokers, InvokableVisitors } from '@intent/kernel';
import { MatchNode, MatchStatementNode } from '@alchemy/ast';

import { MatchChildren, MatchBuilder } from './MatchBuilder';
import { MatchStatementChildren, MatchStatementBuilder } from './MatchStatementBuilder';

export type MatchInvokers = {
    match: MatchNode;
    match_statement: MatchStatementNode;
};

export type MatchDependencies =
    MatchChildren &
    MatchStatementChildren;

export const factory = (invokers: BuilderInvokers<MatchDependencies>): InvokableVisitors<MatchInvokers> => {
    return {
        match: new MatchBuilder(invokers),
        match_statement: new MatchStatementBuilder(invokers),
    };
};
