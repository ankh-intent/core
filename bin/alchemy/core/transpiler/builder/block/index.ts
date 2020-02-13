import { BuilderInvokers, InvokableVisitors } from '@intent/kernel/transpiler';
import {
  BlockNode,
  DecoratedStatementNode,
  StatementNode,
  BreakStatementNode,
  ReturnStatementNode,
  IfStatementNode,
  LoopStatementNode,
  LoopIteratorNode,
  AssignmentStatementNode,
  AssignmentTargetNode,
} from '../../ast';
import { AssignStatementChildren, AssignStatementBuilder } from './AssignStatementBuilder';
import { AssignTargetChildren, AssignTargetBuilder } from './AssignTargetBuilder';
import { BlockChildren, BlockBuilder } from './BlockBuilder';
import { BlockItemChildren, BlockItemBuilder } from './BlockItemBuilder';
import { BlockStatementChildren, BlockStatementBuilder } from './BlockStatementBuilder';
import { BreakStatementChildren, BreakStatementBuilder } from './BreakStatementBuilder';
import { DecoratedStatementChildren, DecoratedStatementBuilder } from './DecoratedStatementBuilder';
import { GenericStatementChildren, GenericStatementBuilder } from './GenericStatementBuilder';
import { IfStatementChildren, IfStatementBuilder } from './IfStatementBuilder';
import { LoopIteratorChildren, LoopIteratorBuilder } from './LoopIteratorBuilder';
import { LoopStatementChildren, LoopStatementBuilder } from './LoopStatementBuilder';
import { ReturnStatementChildren, ReturnStatementBuilder } from './ReturnStatementBuilder';

export type BlockInvokers = {
  block: BlockNode;
  block_item: StatementNode;
  block_statement: StatementNode;
  decorated_statement: DecoratedStatementNode;
  statement: StatementNode;
  assignment_statement: AssignmentStatementNode;
  assignment_target: AssignmentTargetNode;
  break_statement: BreakStatementNode;
  return_statement: ReturnStatementNode;
  if_statement: IfStatementNode;
  loop_statement: LoopStatementNode;
  loop_iterator: LoopIteratorNode;
};
export type BlockDependencies =
  DecoratedStatementChildren &
  BlockItemChildren &
  BlockStatementChildren &
  IfStatementChildren &
  LoopStatementChildren &
  LoopIteratorChildren &
  BreakStatementChildren &
  ReturnStatementChildren &
  AssignStatementChildren &
  AssignTargetChildren &
  GenericStatementChildren &
  BlockChildren;

export const factory = (invokers: BuilderInvokers<BlockDependencies>): InvokableVisitors<BlockInvokers> => {
  return {
    block: new BlockBuilder(invokers),
    block_item: new BlockItemBuilder(invokers),
    block_statement: new BlockStatementBuilder(invokers),
    decorated_statement: new DecoratedStatementBuilder(invokers),
    statement: new GenericStatementBuilder(invokers),
    assignment_statement: new AssignStatementBuilder(invokers),
    assignment_target: new AssignTargetBuilder(invokers),
    break_statement: new BreakStatementBuilder(invokers),
    return_statement: new ReturnStatementBuilder(invokers),
    if_statement: new IfStatementBuilder(invokers),
    loop_statement: new LoopStatementBuilder(invokers),
    loop_iterator: new LoopIteratorBuilder(invokers),
  };
};
