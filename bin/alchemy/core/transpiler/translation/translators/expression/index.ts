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
  LiteralNode, CallableNode, ArrayNode, ObjectNode
} from '../../../ast';

import { ArrayLiteralTranslatorChildren, ArrayLiteralTranslator } from './ArrayLiteralTranslator';
import { CallableLiteralTranslatorChildren, CallableLiteralTranslator } from './CallableLiteralTranslator';
import { CallArgTranslatorChildren, CallArgTranslator } from './CallArgTranslator';
import { CallTranslatorChildren, CallTranslator } from './CallTranslator';
import { ChainTranslatorChildren, ChainTranslator } from './ChainTranslator';
import { ExpressionTranslatorChildren, ExpressionTranslator } from './ExpressionTranslator';
import { IdentifierTranslatorChildren, IdentifierTranslator } from './IdentifierTranslator';
import { IndexedTranslatorChildren, IndexedTranslator } from './IndexedTranslator';
import { IsDomainTranslatorChildren, IsDomainTranslator } from './IsDomainTranslator';
import { LiteralTranslatorChildren, LiteralTranslator } from './LiteralTranslator';
import { ObjectLiteralTranslatorChildren, ObjectLiteralTranslator } from './ObjectLiteralTranslator';
import { OperationTranslatorChildren, OperationTranslator } from './OperationTranslator';
import { PrimitiveTranslatorChildren, PrimitiveTranslator } from './PrimitiveTranslator';

export type ExpressionInvokers = {
  expression: ExpressionNode;
  literal: LiteralNode;
  primitive: LiteralNode;
  object_literal: ObjectNode;
  array_literal: ArrayNode;
  callable: CallableNode;
  identifier: IdentifierNode;
  operation: OperationNode;
  call: CallNode;
  call_arg: CallArgNode;
  chain: ChainNode;
  indexed: IndexedNode;
  is_domain: IsDomainNode;
};

export type ExpressionDependencies =
  ArrayLiteralTranslatorChildren &
  CallableLiteralTranslatorChildren &
  CallArgTranslatorChildren &
  CallTranslatorChildren &
  ChainTranslatorChildren &
  ExpressionTranslatorChildren &
  IdentifierTranslatorChildren &
  IndexedTranslatorChildren &
  IsDomainTranslatorChildren &
  LiteralTranslatorChildren &
  ObjectLiteralTranslatorChildren &
  OperationTranslatorChildren &
  PrimitiveTranslatorChildren
;

export const factory = (invokers: NodeInvokers<ExpressionDependencies>): InvokableVisitors<ExpressionInvokers> => {
  return {
    expression    : new ExpressionTranslator(invokers),
    literal       : new LiteralTranslator(invokers),
    primitive     : new PrimitiveTranslator(invokers),
    object_literal: new ObjectLiteralTranslator(invokers),
    array_literal : new ArrayLiteralTranslator(invokers),
    callable      : new CallableLiteralTranslator(invokers),
    identifier    : new IdentifierTranslator(invokers),
    operation     : new OperationTranslator(invokers),
    call          : new CallTranslator(invokers),
    call_arg      : new CallArgTranslator(invokers),
    chain         : new ChainTranslator(invokers),
    indexed       : new IndexedTranslator(invokers),
    is_domain     : new IsDomainTranslator(invokers),
  };
};
