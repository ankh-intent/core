import { BaseTokenTypes } from '@intent/parser';
import { RootBuilder } from '@intent/kernel/transpiler';

import { ModuleNode } from '../ast';
import { ModuleBuilder, ModuleChildren } from './ModuleBuilder';
import { factory as useBuildersFactory, UseInvokers } from './use';
import { factory as functorBuildersFactory, FunctorInvokers } from './functor';
import { factory as expressionBuildersFactory, ExpressionInvokers } from './expression';
import { factory as domainBuildersFactory, DomainInvokers } from './domain';
import { factory as domainReferenceBuildersFactory, DomainReferenceInvokers } from './domain_reference';

type AlchemyGrammar =
  DomainReferenceInvokers &
  UseInvokers &
  FunctorInvokers &
  ExpressionInvokers &
  DomainInvokers &
  ModuleChildren
;

export class AlchemyBuilder extends RootBuilder<BaseTokenTypes, AlchemyGrammar, ModuleNode> {
  protected get builders() {
    return {
      root: new ModuleBuilder(this.invokers),

      ...expressionBuildersFactory(this.invokers),
      ...functorBuildersFactory(this.invokers),
      ...useBuildersFactory(this.invokers),
      ...domainBuildersFactory(this.invokers),
      ...domainReferenceBuildersFactory(this.invokers),
    };
  }
}

