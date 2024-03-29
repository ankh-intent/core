import { BuilderInvokers, InvokableVisitors } from '@intent/kernel';
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
    ExpressionStatementNode,
} from '@alchemy/ast';
import { AssignStatementChildren, AssignStatementBuilder } from './AssignStatementBuilder';
import { AssignmentTargetChildren, AssignmentTargetBuilder } from './AssignmentTargetBuilder';
import { BlockChildren, BlockBuilder } from './BlockBuilder';
import { BlockExpressionChildren, BlockExpressionBuilder } from './BlockExpressionBuilder';
import { BlockItemChildren, BlockItemBuilder } from './BlockItemBuilder';
import { BlockStatementChildren, BlockStatementBuilder } from './BlockStatementBuilder';
import { BreakStatementChildren, BreakStatementBuilder } from './BreakStatementBuilder';
import { DecoratedStatementChildren, DecoratedStatementBuilder } from './DecoratedStatementBuilder';
import { ExpressionStatementChildren, ExpressionStatementBuilder } from './ExpressionStatementBuilder';
import { GenericStatementChildren, GenericStatementBuilder } from './GenericStatementBuilder';
import { IfStatementChildren, IfStatementBuilder } from './IfStatementBuilder';
import { LoopIteratorChildren, LoopIteratorBuilder } from './LoopIteratorBuilder';
import { LoopStatementChildren, LoopStatementBuilder } from './LoopStatementBuilder';
import { ReturnStatementChildren, ReturnStatementBuilder } from './ReturnStatementBuilder';
import { EmptyBlockBuilder } from './EmptyBlockBuilder';

export type BlockInvokers = {
    block_expression: BlockNode;
    empty_block: BlockNode;
    block: BlockNode;
    block_item: StatementNode;
    block_statement: StatementNode;
    decorated_statement: DecoratedStatementNode;
    statement: StatementNode;
    expression_statement: ExpressionStatementNode;
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
    ExpressionStatementChildren &
    AssignStatementChildren &
    AssignmentTargetChildren &
    GenericStatementChildren &
    BlockExpressionChildren &
    BlockChildren;

export const factory = (invokers: BuilderInvokers<BlockDependencies>): InvokableVisitors<BlockInvokers> => {
    return {
        block_expression: new BlockExpressionBuilder(invokers),
        block: new BlockBuilder(invokers),
        empty_block: new EmptyBlockBuilder(invokers),
        block_item: new BlockItemBuilder(invokers),
        block_statement: new BlockStatementBuilder(invokers),
        decorated_statement: new DecoratedStatementBuilder(invokers),
        statement: new GenericStatementBuilder(invokers),
        expression_statement: new ExpressionStatementBuilder(invokers),
        assignment_statement: new AssignStatementBuilder(invokers),
        assignment_target: new AssignmentTargetBuilder(invokers),
        break_statement: new BreakStatementBuilder(invokers),
        return_statement: new ReturnStatementBuilder(invokers),
        if_statement: new IfStatementBuilder(invokers),
        loop_statement: new LoopStatementBuilder(invokers),
        loop_iterator: new LoopIteratorBuilder(invokers),
    };
};
