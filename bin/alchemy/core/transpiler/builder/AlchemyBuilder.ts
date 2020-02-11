import { BaseTokenTypes } from '@intent/parser';
import { RootBuilder } from '@intent/kernel/transpiler';

import { ModuleNode } from '../ast';
import { QualifierBuilder, QualifierChildren } from './QualifierBuilder';
import { TypeBuilder } from './TypeBuilder';
import { PropertyBuilder, PropertyChildren } from './PropertyBuilder';
import { DecompositionBuilder, DecompositionChildren } from './use/DecompositionBuilder';
import { UseBuilder, UseChildren } from './use/UseBuilder';
import { TypeDefBuilder, TypeDefChildren } from './TypeDefBuilder';
import { CanBuilder, CanChildren } from './CanBuilder';
import { DomainBuilder, DomainChildren } from './DomainBuilder';
import { ModuleBuilder, ModuleChildren } from './ModuleBuilder';
import { ConstraintBuilder, ConstraintChildren } from './ConstraintBuilder';

type AlchemyGrammar =
  QualifierChildren &
  UseChildren &
  DecompositionChildren &
  TypeDefChildren &
  PropertyChildren &
  CanChildren &
  ConstraintChildren &
  DomainChildren &
  ModuleChildren
;

export class AlchemyBuilder extends RootBuilder<BaseTokenTypes, AlchemyGrammar, ModuleNode> {
  protected get builders() {
    return {
      qualifier    : new QualifierBuilder(this.invokers),
      type         : new TypeBuilder(this.invokers),
      property     : new PropertyBuilder(this.invokers),
      use          : new UseBuilder(this.invokers),
      decomposition: new DecompositionBuilder(this.invokers),
      can          : new CanBuilder(this.invokers),
      constraint   : new ConstraintBuilder(this.invokers),
      typedef      : new TypeDefBuilder(this.invokers),
      domain       : new DomainBuilder(this.invokers),
      root         : new ModuleBuilder(this.invokers),
    };
  }
}

