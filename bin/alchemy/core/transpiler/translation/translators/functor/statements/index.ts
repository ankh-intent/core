import { InvokableVisitors, NodeInvokers } from '@intent/plugins';

import {
  BlockNode,
  StatementNode,
  IfStatementNode,
  LoopStatementNode,
  LoopIteratorNode,
  BreakStatementNode,
  ReturnStatementNode,
  AssignmentStatementNode,
  AssignmentTargetNode,
  ExpressionStatementNode,
  DecoratedStatementNode,
} from '../../../../ast';
import { AssignmentStatementTranslator, AssignmentStatementTranslatorChildren } from './AssignmentStatementTranslator';
import { AssignmentTargetTranslator, AssignmentTargetTranslatorChildren } from './AssignmentTargetTranslator';
import { BlockTranslator, BlockTranslatorChildren } from './BlockTranslator';
import { BreakStatementTranslator, BreakStatementTranslatorChildren } from './BreakStatementTranslator';
import { DecoratedStatementTranslator, DecoratedStatementTranslatorChildren } from './DecoratedStatementTranslator';
import { ExpressionStatementTranslator, ExpressionStatementTranslatorChildren } from './ExpressionStatementTranslator';
import { IfStatementTranslator, IfStatementTranslatorChildren } from './IfStatementTranslator';
import { LoopIteratorTranslator, LoopIteratorTranslatorChildren } from './LoopIteratorStatementTranslator';
import { LoopStatementTranslator, LoopStatementTranslatorChildren } from './LoopStatementTranslator';
import { ReturnStatementTranslator, ReturnStatementTranslatorChildren } from './ReturnStatementTranslator';
import { StatementTranslator, StatementTranslatorChildren } from './StatementTranslator';
import { ExpressionInvokers, ExpressionDependencies, factory as expressionTranslatorsFactory } from './expression';

export type StatementInvokers = ExpressionInvokers & {
  block: BlockNode;
  statement: StatementNode;
  if_statement: IfStatementNode;
  loop_statement: LoopStatementNode;
  loop_iterator: LoopIteratorNode;
  break_statement: BreakStatementNode;
  return_statement: ReturnStatementNode;
  assignment_statement: AssignmentStatementNode;
  assignment_target: AssignmentTargetNode;
  expression_statement: ExpressionStatementNode;
  decorated_statement: DecoratedStatementNode;
};

export type StatementDependencies =
  BlockTranslatorChildren &
  DecoratedStatementTranslatorChildren &
  IfStatementTranslatorChildren &
  LoopStatementTranslatorChildren &
  LoopIteratorTranslatorChildren &
  BreakStatementTranslatorChildren &
  ReturnStatementTranslatorChildren &
  AssignmentStatementTranslatorChildren &
  AssignmentTargetTranslatorChildren &
  ExpressionStatementTranslatorChildren &
  ExpressionDependencies &
  StatementTranslatorChildren
;

export const factory = (invokers: NodeInvokers<StatementDependencies>): InvokableVisitors<StatementInvokers> => {
  return {
    block               : new BlockTranslator(invokers),
    statement           : new StatementTranslator(invokers),
    if_statement        : new IfStatementTranslator(invokers),
    loop_statement      : new LoopStatementTranslator(invokers),
    loop_iterator       : new LoopIteratorTranslator(invokers),
    break_statement     : new BreakStatementTranslator(invokers),
    return_statement    : new ReturnStatementTranslator(invokers),
    assignment_statement: new AssignmentStatementTranslator(invokers),
    assignment_target   : new AssignmentTargetTranslator(invokers),
    expression_statement: new ExpressionStatementTranslator(invokers),
    decorated_statement : new DecoratedStatementTranslator(invokers),
    ...expressionTranslatorsFactory(invokers),
  };
};
