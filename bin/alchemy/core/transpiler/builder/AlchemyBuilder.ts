import { BaseTokenTypes } from '@intent/parser';
import { RootBuilder } from '@intent/kernel/transpiler';

import { ChipNode } from '../ast';
import { QualifierBuilder, QualifierChildren } from './QualifierBuilder';
import { TypeBuilder } from './TypeBuilder';
import { PropertyBuilder, PropertyChildren } from './PropertyBuilder';
import { UseBuilder, UseChildren } from './UseBuilder';
import { TypeDefBuilder, TypeDefChildren } from './TypeDefBuilder';
import { CanBuilder, CanChildren } from './CanBuilder';
import { DomainBuilder, DomainChildren } from './DomainBuilder';
import { ChipBuilder, ChipChildren } from './ChipBuilder';
import { ConstraintBuilder, ConstraintChildren } from './ConstraintBuilder';

type AlchemyGrammar =
  QualifierChildren &
  UseChildren &
  TypeDefChildren &
  PropertyChildren &
  CanChildren &
  ConstraintChildren &
  DomainChildren &
  ChipChildren
;

export class AlchemyBuilder extends RootBuilder<BaseTokenTypes, AlchemyGrammar, ChipNode> {
  protected get builders() {
    return {
      qualifier : new QualifierBuilder(this.invokers),
      type      : new TypeBuilder(this.invokers),
      property  : new PropertyBuilder(this.invokers),
      use       : new UseBuilder(this.invokers),
      can       : new CanBuilder(this.invokers),
      constraint: new ConstraintBuilder(this.invokers),
      typedef   : new TypeDefBuilder(this.invokers),
      domain    : new DomainBuilder(this.invokers),
      root      : new ChipBuilder(this.invokers),
    };
  }
}

