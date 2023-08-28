import { AbstractNode, BuilderInvokers, InvokableVisitors } from '@intent/kernel';

import {
    ExpressionNode,
    IdentifierNode,
    CallArgNode,
    CallArgsNode,
    CallNode,
    IndexedNode,
    ChainNode,
    PrimitiveNode,
    ArrayNode,
    ObjectNode,
    ObjectPropertyNode,
    CallableNode,
    IsDomainNode,
    UnaryNode,
    PostfixNode,
    OperationNode,
} from '@alchemy/ast';

import { AccessibleChildren, AccessibleBuilder } from './AccessibleBuilder';
import { AssignableChildren, AssignableBuilder } from './AssignableBuilder';
import { AdditiveChildren, AdditiveBuilder } from './AdditiveBuilder';
import { BooleanChildren, BooleanBuilder } from './BooleanBuilder';
import { CallArgChildren, CallArgBuilder } from './CallArgBuilder';
import { CallArgsChildren, CallArgsBuilder } from './CallArgsBuilder';
import { CallChildren, CallBuilder } from './CallBuilder';
import { ChainChildren, ChainBuilder } from './ChainBuilder';
import { ComparisonChildren, ComparisonBuilder } from './ComparisonBuilder';
import { ExpressionChildren, ExpressionBuilder } from './ExpressionBuilder';
import { IdentifierChildren, IdentifierBuilder } from './IdentifierBuilder';
import { IdentifierExpressionChildren, IdentifierExpressionBuilder } from './IdentifierExpressionBuilder';
import { IndexedChildren, IndexedBuilder } from './IndexedBuilder';
import { IsDomainChildren, IsDomainBuilder } from './IsDomainBuilder';
import { ArrayChildren, ArrayBuilder } from './literal/ArrayBuilder';
import { CallableChildren, CallableBuilder } from './literal/CallableBuilder';
import { LiteralChildren, LiteralBuilder } from './literal/LiteralBuilder';
import { ObjectChildren, ObjectBuilder } from './literal/ObjectBuilder';
import { ObjectPropertyChildren, ObjectPropertyBuilder } from './literal/ObjectPropertyBuilder';
import { MultiplicativeChildren, MultiplicativeBuilder } from './MultiplicativeBuilder';
import { OperationChildren, OperationBuilder } from './OperationBuilder';
import { PostfixChildren, PostfixBuilder } from './PostfixBuilder';
import { UnaryChildren, UnaryBuilder } from './UnaryBuilder';
import { NumerativeChildren, NumerativeBuilder } from './NumerativeBuilder';
import { ApplicativeChildren, ApplicativeBuilder } from './ApplicativeBuilder';
import { factory as matchBuildersFactory, MatchDependencies, MatchInvokers } from './match';

export type ExpressionInvokers = MatchInvokers & {
    expression: ExpressionNode;
    identifier: IdentifierNode;
    comparison: ExpressionNode;
    chain: ChainNode;
    indexed: IndexedNode;
    postfix: PostfixNode;
    call: CallNode;
    call_args: CallArgsNode;
    call_arg: CallArgNode;
    is_domain: IsDomainNode;
    operation: OperationNode;
    boolean: ExpressionNode;
    additive: ExpressionNode;
    multiplicative: ExpressionNode;
    numerative: ExpressionNode;
    applicative: ExpressionNode;
    unary: UnaryNode;
    assignable: ExpressionNode;
    accessible: AbstractNode;
    literal: PrimitiveNode;
    callable: CallableNode;
    array: ArrayNode;
    object: ObjectNode;
    object_property: ObjectPropertyNode;
    identifier_expression: ExpressionNode<IdentifierNode>;
};
export type ExpressionDependencies =
    OperationChildren &
    ComparisonChildren &
    CallArgsChildren &
    CallArgChildren &
    IdentifierChildren &
    IdentifierExpressionChildren &
    CallChildren &
    IsDomainChildren &
    ChainChildren &
    IndexedChildren &
    BooleanChildren &
    AdditiveChildren &
    MultiplicativeChildren &
    NumerativeChildren &
    ApplicativeChildren &
    UnaryChildren &
    PostfixChildren &
    AssignableChildren &
    AccessibleChildren &
    LiteralChildren &
    ArrayChildren &
    ObjectChildren &
    CallableChildren &
    ObjectPropertyChildren &
    ExpressionChildren &
    MatchDependencies;

export const factory = (invokers: BuilderInvokers<ExpressionDependencies>): InvokableVisitors<ExpressionInvokers> => {
    return {
        expression: new ExpressionBuilder(invokers),
        operation: new OperationBuilder(invokers),
        identifier: new IdentifierBuilder(invokers),
        comparison: new ComparisonBuilder(invokers),
        chain: new ChainBuilder(invokers),
        indexed: new IndexedBuilder(invokers),
        postfix: new PostfixBuilder(invokers),
        call: new CallBuilder(invokers),
        call_args: new CallArgsBuilder(invokers),
        call_arg: new CallArgBuilder(invokers),
        is_domain: new IsDomainBuilder(invokers),
        boolean: new BooleanBuilder(invokers),
        additive: new AdditiveBuilder(invokers),
        multiplicative: new MultiplicativeBuilder(invokers),
        numerative: new NumerativeBuilder(invokers),
        applicative: new ApplicativeBuilder(invokers),
        unary: new UnaryBuilder(invokers),
        assignable: new AssignableBuilder(invokers),
        accessible: new AccessibleBuilder(invokers),
        literal: new LiteralBuilder(invokers),
        callable: new CallableBuilder(invokers),
        array: new ArrayBuilder(invokers),
        object: new ObjectBuilder(invokers),
        object_property: new ObjectPropertyBuilder(invokers),
        identifier_expression: new IdentifierExpressionBuilder(invokers),

        ...matchBuildersFactory(invokers),
    };
};
