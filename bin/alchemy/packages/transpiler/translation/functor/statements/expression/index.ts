import { InvokableVisitors, NodeInvokers } from '@intent/plugins';
import {
    ExpressionNode,
    IdentifierNode,
    ChainNode,
    IndexedNode,
    CallNode,
    CallArgNode,
    IsDomainNode,
    OperationNode,
    PrimitiveNode,
    CallableNode,
    ArrayNode,
    ObjectNode,
    UnaryNode,
    ObjectPropertyNode,
    PostfixNode,
    MatchNode,
    MatchStatementNode,
} from '@alchemy/ast';

import { ArrayLiteralTranslatorChildren, ArrayLiteralTranslator } from './literal/ArrayLiteralTranslator';
import { CallableLiteralTranslatorChildren, CallableLiteralTranslator } from './literal/CallableLiteralTranslator';
import {
    ObjectLiteralPropertyTranslator,
    ObjectLiteralPropertyTranslatorChildren,
} from './literal/ObjectLiteralPropertyTranslator';
import { CallArgTranslatorChildren, CallArgTranslator } from './postfix/CallArgTranslator';
import { CallTranslatorChildren, CallTranslator } from './postfix/CallTranslator';
import { ChainTranslatorChildren, ChainTranslator } from './postfix/ChainTranslator';
import { ExpressionTranslatorChildren, ExpressionTranslator } from './ExpressionTranslator';
import { IdentifierTranslatorChildren, IdentifierTranslator } from './IdentifierTranslator';
import { IndexedTranslatorChildren, IndexedTranslator } from './postfix/IndexedTranslator';
import { IsDomainTranslatorChildren, IsDomainTranslator } from './postfix/IsDomainTranslator';
import { LiteralTranslatorChildren, LiteralTranslator } from './literal/LiteralTranslator';
import { ObjectLiteralTranslatorChildren, ObjectLiteralTranslator } from './literal/ObjectLiteralTranslator';
import { OperationTranslatorChildren, OperationTranslator } from './OperationTranslator';
import { PrimitiveTranslatorChildren, PrimitiveTranslator } from './literal/PrimitiveTranslator';
import { PostfixTranslatorChildren, PostfixTranslator } from './postfix/PostfixTranslator';
import { UnaryTranslatorChildren, UnaryTranslator } from './unary/UnaryTranslator';
import { MatchTranslatorChildren, MatchTranslator } from './MatchTranslator';
import { MatchStatementTranslatorChildren, MatchStatementTranslator } from './MatchStatementTranslator';

export type ExpressionInvokers = {
    expression: ExpressionNode;
    literal: PrimitiveNode;
    primitive: PrimitiveNode;
    object_literal: ObjectNode;
    object_property: ObjectPropertyNode;
    array_literal: ArrayNode;
    callable: CallableNode;
    identifier: IdentifierNode;
    operation: OperationNode;
    call: CallNode;
    call_arg: CallArgNode;
    chain: ChainNode;
    indexed: IndexedNode;
    is_domain: IsDomainNode;
    postfix: PostfixNode;
    unary: UnaryNode;
    match: MatchNode;
    match_statement: MatchStatementNode;
};

export type ExpressionDependencies =
    ArrayLiteralTranslatorChildren &
    CallableLiteralTranslatorChildren &
    CallArgTranslatorChildren &
    CallTranslatorChildren &
    ChainTranslatorChildren &
    IdentifierTranslatorChildren &
    IndexedTranslatorChildren &
    IsDomainTranslatorChildren &
    LiteralTranslatorChildren &
    ObjectLiteralTranslatorChildren &
    ObjectLiteralPropertyTranslatorChildren &
    OperationTranslatorChildren &
    PrimitiveTranslatorChildren &
    UnaryTranslatorChildren &
    PostfixTranslatorChildren &
    ExpressionTranslatorChildren &
    MatchTranslatorChildren &
    MatchStatementTranslatorChildren
    ;

export const factory = (invokers: NodeInvokers<ExpressionDependencies>): InvokableVisitors<ExpressionInvokers> => {
    return {
        expression: new ExpressionTranslator(invokers),
        literal: new LiteralTranslator(invokers),
        primitive: new PrimitiveTranslator(invokers),
        object_literal: new ObjectLiteralTranslator(invokers),
        object_property: new ObjectLiteralPropertyTranslator(invokers),
        array_literal: new ArrayLiteralTranslator(invokers),
        callable: new CallableLiteralTranslator(invokers),
        identifier: new IdentifierTranslator(invokers),
        operation: new OperationTranslator(invokers),
        call: new CallTranslator(invokers),
        call_arg: new CallArgTranslator(invokers),
        chain: new ChainTranslator(invokers),
        indexed: new IndexedTranslator(invokers),
        is_domain: new IsDomainTranslator(invokers),
        unary: new UnaryTranslator(invokers),
        postfix: new PostfixTranslator(invokers),
        match: new MatchTranslator(invokers),
        match_statement: new MatchStatementTranslator(invokers),
    };
};
