import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker, InvokableVisitors, BuilderInvokers } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../../Alchemy';
import { ExpressionNode, BinaryOperationNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';
import { ObjectBuilder, ObjectChildren } from './literal/ObjectBuilder';
import { LiteralBuilder, LiteralChildren } from './literal/LiteralBuilder';
import { AccessorBuilder, AccessorChildren } from './AccessorBuilder';
import { AdditiveBuilder, AdditiveChildren } from './AdditiveBuilder';
import { BooleanBuilder, BooleanChildren } from './BooleanBuilder';
import { CallArgBuilder, CallArgChildren } from './CallArgBuilder';
import { CallArgsBuilder, CallArgsChildren } from './CallArgsBuilder';
import { CallBuilder, CallChildren } from './CallBuilder';
import { ChainBuilder, ChainChildren } from './ChainBuilder';
import { ComparisionBuilder, ComparisionChildren } from './ComparisionBuilder';
import { IdentifierBuilder, IdentifierChildren } from './IdentifierBuilder';
import { IndexedBuilder, IndexedChildren } from './IndexedBuilder';
import { ObjectPropertyBuilder, ObjectPropertyChildren } from './literal/ObjectPropertyBuilder';
import { MultiplicativeBuilder, MultiplicativeChildren } from './MultiplicativeBuilder';

export type ExpressionInvokers =
  ComparisionChildren &
  CallArgsChildren &
  CallArgChildren &
  IdentifierChildren &
  CallChildren &
  ChainChildren &
  IndexedChildren &
  BooleanChildren &
  AdditiveChildren &
  MultiplicativeChildren &
  AccessorChildren &
  LiteralChildren &
  ObjectChildren &
  ObjectPropertyChildren;

export interface ExpressionChildren extends AlchemyBuildInvokers, ExpressionInvokers {
  comparision: BuildInvoker<ExpressionNode>;
  chain: BuildInvoker<BinaryOperationNode>;
  indexed: BuildInvoker<BinaryOperationNode>;
  call: BuildInvoker<BinaryOperationNode>;
}

export class ExpressionBuilder extends BaseBuilder<ExpressionNode, ExpressionChildren> {
  protected build(tokens, { peek }: TypedTokenMatcherInterface) {
    const base = this.child.comparision(tokens);
    const operations: BinaryOperationNode[] = [];

    while (true) {
      if (peek.symbol('.')) {
        operations.push(this.child.chain(tokens));
      } else if (peek.symbol('[')) {
        operations.push(this.child.indexed(tokens));
      } else if (peek.symbol('(')) {
        operations.push(this.child.call(tokens));
      } else {
        break;
      }
    }

    if (operations.length) {
      return new ExpressionNode(
        base,
        operations,
      );
    }

    return base;
  }

  static buildersFactory(invokers: BuilderInvokers<ExpressionChildren>): InvokableVisitors<ExpressionChildren> {
    return {
      expression     : new ExpressionBuilder(invokers),
      identifier     : new IdentifierBuilder(invokers),
      comparision    : new ComparisionBuilder(invokers),
      chain          : new ChainBuilder(invokers),
      indexed        : new IndexedBuilder(invokers),
      call           : new CallBuilder(invokers),
      call_args      : new CallArgsBuilder(invokers),
      call_arg       : new CallArgBuilder(invokers),
      boolean        : new BooleanBuilder(invokers),
      additive       : new AdditiveBuilder(invokers),
      multiplicative : new MultiplicativeBuilder(invokers),
      accessor       : new AccessorBuilder(invokers),
      literal        : new LiteralBuilder(invokers),
      object         : new ObjectBuilder(invokers),
      object_property: new ObjectPropertyBuilder(invokers),
    };
  }
}
