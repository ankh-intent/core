import { IdentifiableFactory } from '@intent/consumers';
import { DependencyManager } from '@intent/kernel';
import { Module } from '../../../modules/Module';
import { ModuleNode } from '../../ast';
import { RootTranslator } from '../RootTranslator';

import { ModuleTranslator, ModuleTranslatorChildren } from './ModuleTranslator';
type AlchemyGrammar =
  ModuleTranslatorChildren
;

export class AlchemyTranslator extends RootTranslator<AlchemyGrammar> {
  private readonly factory: IdentifiableFactory<ModuleNode, Module>;
  private readonly tree: DependencyManager<ModuleNode, Module>;

  constructor(factory: IdentifiableFactory<ModuleNode, Module>, tree: DependencyManager<ModuleNode, Module>) {
    super();
    this.factory = factory;
    this.tree = tree;
  }

  protected get visitors() {
    return {
      root: new ModuleTranslator(this.invokers, this.factory, this.tree),
    };
  }
}
