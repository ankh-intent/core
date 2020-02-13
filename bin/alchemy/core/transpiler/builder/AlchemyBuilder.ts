import { BaseTokenTypes } from '@intent/parser';
import { RootBuilder } from '@intent/kernel/transpiler';

import { ModuleNode } from '../ast';
import { QualifierBuilder, QualifierChildren } from './QualifierBuilder';
import { TypeBuilder, TypeChildren } from './TypeBuilder';
import { TypeGenericBuilder, TypeGenericChildren } from './TypeGenericBuilder';
import { TypePropertyBuilder, PropertyChildren } from './TypePropertyBuilder';
import { DecompositionBuilder, DecompositionChildren } from './use/DecompositionBuilder';
import { UseBuilder, UseChildren } from './use/UseBuilder';
import { UsesBuilder, UsesChildren } from './use/UsesBuilder';
import { CanBuilder, CanChildren } from './CanBuilder';
import { FunctorBuilder, FunctorChildren } from './functor/FunctorBuilder';
import { FunctorArgsBuilder, FunctorArgsChildren } from './functor/FunctorArgsBuilder';
import { FunctorBodyBuilder, FunctorBodyChildren } from './functor/FunctorBodyBuilder';
import { DomainBuilder, DomainChildren } from './domain/DomainBuilder';
import { InterfaceBuilder, InterfaceChildren } from './domain/interface/InterfaceBuilder';
import { InterfacePropertyBuilder, InterfacePropertyChildren } from './domain/interface/InterfacePropertyBuilder';
import { ModuleBuilder, ModuleChildren } from './ModuleBuilder';
import { ConstraintBuilder, ConstraintChildren } from './ConstraintBuilder';
import { ExpressionBuilder, ExpressionChildren } from './expression/ExpressionBuilder';
import { EnumBuilder, EnumChildren } from './EnumBuilder';

type AlchemyGrammar =
  QualifierChildren &
  UseChildren &
  TypeChildren &
  TypeGenericChildren &
  UsesChildren &
  DecompositionChildren &
  PropertyChildren &
  CanChildren &
  FunctorChildren &
  FunctorArgsChildren &
  FunctorBodyChildren &
  ExpressionChildren &
  EnumChildren &
  ConstraintChildren &
  DomainChildren &
  InterfaceChildren &
  InterfacePropertyChildren &
  ModuleChildren
;

export class AlchemyBuilder extends RootBuilder<BaseTokenTypes, AlchemyGrammar, ModuleNode> {
  protected get builders() {
    return {
      ...ExpressionBuilder.buildersFactory(this.invokers),
      qualifier    : new QualifierBuilder(this.invokers),
      type         : new TypeBuilder(this.invokers),
      type_generic : new TypeGenericBuilder(this.invokers),
      property     : new TypePropertyBuilder(this.invokers),
      use          : new UseBuilder(this.invokers),
      uses         : new UsesBuilder(this.invokers),
      decomposition: new DecompositionBuilder(this.invokers),
      can          : new CanBuilder(this.invokers),
      functor      : new FunctorBuilder(this.invokers),
      args         : new FunctorArgsBuilder(this.invokers),
      block        : new FunctorBodyBuilder(this.invokers),
      constraint   : new ConstraintBuilder(this.invokers),
      domain       : new DomainBuilder(this.invokers),
      interface    : new InterfaceBuilder(this.invokers),
      iproperty    : new InterfacePropertyBuilder(this.invokers),
      enum         : new EnumBuilder(this.invokers),
      root         : new ModuleBuilder(this.invokers),
    };
  }
}

