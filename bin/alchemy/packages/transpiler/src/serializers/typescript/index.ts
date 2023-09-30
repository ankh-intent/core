import { RootSerializer } from '../RootSerializer';

import { DomainReferenceSerializer, DomainReferenceSerializerChildren } from './DomainReferenceSerializer';
import { DomainSerializer, DomainSerializerChildren } from './DomainSerializer';
import { ArrayLiteralSerializer, ArrayLiteralSerializerChildren } from './expression/ArrayLiteralSerializer';
import { CallableLiteralSerializer, CallableLiteralSerializerChildren } from './expression/CallableLiteralSerializer';
import { CallArgSerializer, CallArgSerializerChildren } from './expression/CallArgSerializer';
import { CallSerializer, CallSerializerChildren } from './expression/CallSerializer';
import { ChainSerializer, ChainSerializerChildren } from './expression/ChainSerializer';
import { IdentifierSerializer, IdentifierSerializerChildren } from './expression/IdentifierSerializer';
import { IndexedSerializer, IndexedSerializerChildren } from './expression/IndexedSerializer';
import { IsDomainSerializer, IsDomainSerializerChildren } from './expression/IsDomainSerializer';
import { LiteralSerializer, LiteralSerializerChildren } from './expression/LiteralSerializer';
import { ObjectLiteralSerializer, ObjectLiteralSerializerChildren } from './expression/ObjectLiteralSerializer';
import { OperationSerializer, OperationSerializerChildren } from './expression/OperationSerializer';
import { PrimitiveSerializer, PrimitiveSerializerChildren } from './expression/PrimitiveSerializer';
import {
    AssignmentStatementSerializer,
    AssignmentStatementSerializerChildren,
} from './functor/AssignmentStatementSerializer';
import { AssignmentTargetSerializerChildren, AssignmentTargetSerializer } from './functor/AssignmentTargetSerializer';
import { BlockSerializer, BlockSerializerChildren } from './functor/BlockSerializer';
import { BreakStatementSerializer, BreakStatementSerializerChildren } from './functor/BreakStatementSerializer';
import {
    DecoratedStatementSerializer,
    DecoratedStatementSerializerChildren,
} from './functor/DecoratedStatementSerializer';
import { ExpressionSerializer, ExpressionSerializerChildren } from './expression/ExpressionSerializer';
import {
    ExpressionStatementSerializer,
    ExpressionStatementSerializerChildren,
} from './functor/ExpressionStatementSerializer';
import { FunctorSerializer, FunctorSerializerChildren } from './functor/FunctorSerializer';
import { FunctorArgsSerializer, FunctorArgsSerializerChildren } from './functor/FunctorArgsSerializer';
import { FunctorBodySerializer, FunctorBodySerializerChildren } from './functor/FunctorBodySerializer';
import { IfStatementSerializer, IfStatementSerializerChildren } from './functor/IfStatementSerializer';
import { LoopIteratorSerializer, LoopIteratorSerializerChildren } from './functor/LoopIteratorStatementSerializer';
import { LoopStatementSerializer, LoopStatementSerializerChildren } from './functor/LoopStatementSerializer';
import { ReturnStatementSerializer, ReturnStatementSerializerChildren } from './functor/ReturnStatementSerializer';
import { StatementSerializer, StatementSerializerChildren } from './functor/StatementSerializer';
import { DereferenceSerializer, DereferenceSerializerChildren } from './functor/DereferenceSerializer';
import { ObjectSpreadSerializer, ObjectSpreadSerializerChildren } from './functor/ObjectSpreadSerializer';
import { ObjectSpreadItemSerializer, ObjectSpreadItemSerializerChildren } from './functor/ObjectSpreadItemSerializer';
import { ModuleSerializer, ModuleNodeSerializerChildren } from './ModuleSerializer';
import { UsesSerializer, UsesSerializerChildren } from './UsesSerializer';
import { UseSerializer, UseSerializerChildren } from './UseSerializer';

type AlchemyGrammar =
    DereferenceSerializerChildren &
    ObjectSpreadSerializerChildren &
    ObjectSpreadItemSerializerChildren &
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
    AssignmentTargetSerializerChildren &
    ExpressionStatementSerializerChildren &
    LiteralSerializerChildren &
    PrimitiveSerializerChildren &
    ArrayLiteralSerializerChildren &
    ObjectLiteralSerializerChildren &
    CallableLiteralSerializerChildren &
    IdentifierSerializerChildren &
    OperationSerializerChildren &
    ChainSerializerChildren &
    IndexedSerializerChildren &
    CallSerializerChildren &
    CallArgSerializerChildren &
    IsDomainSerializerChildren &
    ModuleNodeSerializerChildren
    ;

export class TypescriptSerializer extends RootSerializer<AlchemyGrammar> {
    protected get visitors() {
        return {
            root: new ModuleSerializer(this.invokers),
            use: new UseSerializer(this.invokers),
            uses: new UsesSerializer(this.invokers),
            functor: new FunctorSerializer(this.invokers),
            args: new FunctorArgsSerializer(this.invokers),
            functor_body: new FunctorBodySerializer(this.invokers),
            domain: new DomainSerializer(this.invokers),
            type: new DomainReferenceSerializer(this.invokers),
            block: new BlockSerializer(this.invokers),
            statement: new StatementSerializer(this.invokers),
            if_statement: new IfStatementSerializer(this.invokers),
            loop_statement: new LoopStatementSerializer(this.invokers),
            loop_iterator: new LoopIteratorSerializer(this.invokers),
            break_statement: new BreakStatementSerializer(this.invokers),
            return_statement: new ReturnStatementSerializer(this.invokers),
            expression: new ExpressionSerializer(this.invokers),
            assignment_statement: new AssignmentStatementSerializer(this.invokers),
            assignment_target: new AssignmentTargetSerializer(this.invokers),
            expression_statement: new ExpressionStatementSerializer(this.invokers),
            decorated_statement: new DecoratedStatementSerializer(this.invokers),
            literal: new LiteralSerializer(this.invokers),
            primitive: new PrimitiveSerializer(this.invokers),
            object_literal: new ObjectLiteralSerializer(this.invokers),
            array_literal: new ArrayLiteralSerializer(this.invokers),
            callable: new CallableLiteralSerializer(this.invokers),
            identifier: new IdentifierSerializer(this.invokers),
            operation: new OperationSerializer(this.invokers),
            call: new CallSerializer(this.invokers),
            call_arg: new CallArgSerializer(this.invokers),
            chain: new ChainSerializer(this.invokers),
            indexed: new IndexedSerializer(this.invokers),
            is_domain: new IsDomainSerializer(this.invokers),
            dereference: new DereferenceSerializer(this.invokers),
            object_spread: new ObjectSpreadSerializer(this.invokers),
            object_spread_item: new ObjectSpreadItemSerializer(this.invokers),
        };
    }
}
