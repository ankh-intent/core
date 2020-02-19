import { RootSerializer } from '../RootSerializer';

import { DomainReferenceSerializer, DomainReferenceSerializerChildren } from './DomainReferenceSerializer';
import { DomainSerializer, DomainSerializerChildren } from './DomainSerializer';
import { AssignmentStatementSerializer, AssignmentStatementSerializerChildren } from './functor/AssignmentStatementSerializer';
import { BlockSerializer, BlockSerializerChildren } from './functor/BlockSerializer';
import { BreakStatementSerializer, BreakStatementSerializerChildren } from './functor/BreakStatementSerializer';
import { DecoratedStatementSerializer, DecoratedStatementSerializerChildren } from './functor/DecoratedStatementSerializer';
import { ExpressionSerializer, ExpressionSerializerChildren } from './functor/ExpressionSerializer';
import { ExpressionStatementSerializer, ExpressionStatementSerializerChildren } from './functor/ExpressionStatementSerializer';
import { FunctorSerializer, FunctorSerializerChildren } from './functor/FunctorSerializer';
import { FunctorArgsSerializer, FunctorArgsSerializerChildren } from './functor/FunctorArgsSerializer';
import { FunctorBodySerializer, FunctorBodySerializerChildren } from './functor/FunctorBodySerializer';
import { IfStatementSerializer, IfStatementSerializerChildren } from './functor/IfStatementSerializer';
import { LoopIteratorSerializer, LoopIteratorSerializerChildren } from './functor/LoopIteratorStatementSerializer';
import { LoopStatementSerializer, LoopStatementSerializerChildren } from './functor/LoopStatementSerializer';
import { ReturnStatementSerializer, ReturnStatementSerializerChildren } from './functor/ReturnStatementSerializer';
import { StatementSerializer, StatementSerializerChildren } from './functor/StatementSerializer';
import { ModuleSerializer, ModuleNodeSerializerChildren } from './ModuleSerializer';
import { UsesSerializer, UsesSerializerChildren } from './UsesSerializer';
import { UseSerializer, UseSerializerChildren } from './UseSerializer';

type AlchemyGrammar =
  UseSerializerChildren &
  UsesSerializerChildren &
  FunctorSerializerChildren &
  FunctorArgsSerializerChildren &
  FunctorBodySerializerChildren &
  DomainSerializerChildren &
  DomainReferenceSerializerChildren &
  BlockSerializerChildren &
  DecoratedStatementSerializerChildren &
  StatementSerializerChildren &
  IfStatementSerializerChildren &
  LoopStatementSerializerChildren &
  LoopIteratorSerializerChildren &
  BreakStatementSerializerChildren &
  ReturnStatementSerializerChildren &
  ExpressionSerializerChildren &
  AssignmentStatementSerializerChildren &
  ExpressionStatementSerializerChildren &
  ModuleNodeSerializerChildren
;

export class TypescriptSerializer extends RootSerializer<AlchemyGrammar> {
  protected get visitors() {
    return {
      root                : new ModuleSerializer(this.invokers),
      use                 : new UseSerializer(this.invokers),
      uses                : new UsesSerializer(this.invokers),
      functor             : new FunctorSerializer(this.invokers),
      args                : new FunctorArgsSerializer(this.invokers),
      functor_body        : new FunctorBodySerializer(this.invokers),
      domain              : new DomainSerializer(this.invokers),
      type                : new DomainReferenceSerializer(this.invokers),
      block               : new BlockSerializer(this.invokers),
      statement           : new StatementSerializer(this.invokers),
      if_statement        : new IfStatementSerializer(this.invokers),
      loop_statement      : new LoopStatementSerializer(this.invokers),
      loop_iterator       : new LoopIteratorSerializer(this.invokers),
      break_statement     : new BreakStatementSerializer(this.invokers),
      return_statement    : new ReturnStatementSerializer(this.invokers),
      expression          : new ExpressionSerializer(this.invokers),
      assignment_statement: new AssignmentStatementSerializer(this.invokers),
      expression_statement: new ExpressionStatementSerializer(this.invokers),
      decorated_statement : new DecoratedStatementSerializer(this.invokers),
    };
  }
}
