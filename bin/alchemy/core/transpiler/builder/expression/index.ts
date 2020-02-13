import { BuilderInvokers, InvokableVisitors } from '@intent/kernel/transpiler';

import {
  ExpressionNode,
  IdentifierNode,
  CallArgNode,
  CallArgsNode,
  CallNode,
  IndexedNode,
  ChainNode,
  LiteralNode,
  ArrayNode,
  ObjectNode,
  ObjectPropertyNode,
  CallableNode, IsDomainNode,
} from '../../ast';

import { AccessorChildren, AccessorBuilder } from './AccessorBuilder';
import { AdditiveChildren, AdditiveBuilder } from './AdditiveBuilder';
import { BooleanChildren, BooleanBuilder } from './BooleanBuilder';
import { CallArgChildren, CallArgBuilder } from './CallArgBuilder';
import { CallArgsChildren, CallArgsBuilder } from './CallArgsBuilder';
import { CallChildren, CallBuilder } from './CallBuilder';
import { ChainChildren, ChainBuilder } from './ChainBuilder';
import { ComparisionChildren, ComparisionBuilder } from './ComparisionBuilder';
import { ExpressionChildren, ExpressionBuilder } from './ExpressionBuilder';
import { IdentifierChildren, IdentifierBuilder } from './IdentifierBuilder';
import { IndexedChildren, IndexedBuilder } from './IndexedBuilder';
import { IsDomainBuilder, IsDomainChildren } from './IsDomainBuilder';
import { ArrayChildren, ArrayBuilder } from './literal/ArrayBuilder';
import { CallableChildren, CallableBuilder } from './literal/CallableBuilder';
import { LiteralChildren, LiteralBuilder } from './literal/LiteralBuilder';
import { ObjectChildren, ObjectBuilder } from './literal/ObjectBuilder';
import { ObjectPropertyChildren, ObjectPropertyBuilder } from './literal/ObjectPropertyBuilder';
import { MultiplicativeChildren, MultiplicativeBuilder } from './MultiplicativeBuilder';

export type ExpressionInvokers = {
  expression: ExpressionNode;
  identifier: IdentifierNode;
  comparision: ExpressionNode;
  chain: ChainNode;
  indexed: IndexedNode;
  call: CallNode;
  call_args: CallArgsNode;
  call_arg: CallArgNode;
  is_domain: IsDomainNode;
  boolean: ExpressionNode;
  additive: ExpressionNode;
  multiplicative: ExpressionNode;
  accessor: ExpressionNode;
  literal: LiteralNode;
  callable: CallableNode;
  array: ArrayNode;
  object: ObjectNode;
  object_property: ObjectPropertyNode;
};
export type ExpressionDependencies =
  ComparisionChildren &
  CallArgsChildren &
  CallArgChildren &
  IdentifierChildren &
  CallChildren &
  IsDomainChildren &
  ChainChildren &
  IndexedChildren &
  BooleanChildren &
  AdditiveChildren &
  MultiplicativeChildren &
  AccessorChildren &
  LiteralChildren &
  ArrayChildren &
  ObjectChildren &
  CallableChildren &
  ObjectPropertyChildren &
  ExpressionChildren;

export const factory = (invokers: BuilderInvokers<ExpressionDependencies>): InvokableVisitors<ExpressionInvokers> => {
  return {
    expression     : new ExpressionBuilder(invokers),
    identifier     : new IdentifierBuilder(invokers),
    comparision    : new ComparisionBuilder(invokers),
    chain          : new ChainBuilder(invokers),
    indexed        : new IndexedBuilder(invokers),
    call           : new CallBuilder(invokers),
    call_args      : new CallArgsBuilder(invokers),
    call_arg       : new CallArgBuilder(invokers),
    is_domain      : new IsDomainBuilder(invokers),
    boolean        : new BooleanBuilder(invokers),
    additive       : new AdditiveBuilder(invokers),
    multiplicative : new MultiplicativeBuilder(invokers),
    accessor       : new AccessorBuilder(invokers),
    literal        : new LiteralBuilder(invokers),
    callable       : new CallableBuilder(invokers),
    array          : new ArrayBuilder(invokers),
    object         : new ObjectBuilder(invokers),
    object_property: new ObjectPropertyBuilder(invokers),
  };
};
