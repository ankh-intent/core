import { InvokableVisitors, NodeInvokers } from '@intent/plugins';
import { FunctorNode, FunctorArgsNode, FunctorBodyNode, FunctorArgNode } from '@alchemy/ast';

import { FunctorArgsTranslator, FunctorArgsTranslatorChildren } from './FunctorArgsTranslator';
import { FunctorArgTranslator, FunctorArgTranslatorChildren } from './FunctorArgTranslator';
import { FunctorBodyTranslator, FunctorBodyTranslatorChildren } from './FunctorBodyTranslator';
import { FunctorTranslator, FunctorTranslatorChildren } from './FunctorTranslator';
import { StatementInvokers, StatementDependencies, factory as statementsTranslatorsFactory } from './statements';

export type FunctorInvokers = StatementInvokers & {
    functor: FunctorNode;
    functor_args: FunctorArgsNode;
    functor_arg: FunctorArgNode;
    functor_body: FunctorBodyNode;
};

export type FunctorDependencies =
    FunctorArgsTranslatorChildren &
    FunctorArgTranslatorChildren &
    FunctorBodyTranslatorChildren &
    StatementDependencies &
    FunctorTranslatorChildren
    ;

export const factory = (invokers: NodeInvokers<FunctorDependencies>): InvokableVisitors<FunctorInvokers> => {
    return {
        functor: new FunctorTranslator(invokers),
        functor_args: new FunctorArgsTranslator(invokers),
        functor_arg: new FunctorArgTranslator(invokers),
        functor_body: new FunctorBodyTranslator(invokers),
        ...statementsTranslatorsFactory(invokers),
    };
};
