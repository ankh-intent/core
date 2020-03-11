import { IdentifiableFactory } from '@intent/consumers';
import { DependencyManager } from '@intent/kernel';
import { NodeInvokers } from '@intent/plugins';
import { Module } from '../../../modules/Module';
import { ModuleNode, DomainNode, UsesNode } from '../../ast';
import { NodeTranslator } from '../NodeTranslator';

export type ModuleTranslatorChildren = {
  // uses: UsesNode;
  // domain: DomainNode;
}

export class ModuleTranslator extends NodeTranslator<ModuleNode, Module, ModuleTranslatorChildren> {
  private readonly factory: IdentifiableFactory<ModuleNode, Module>;
  private readonly tree: DependencyManager<ModuleNode, Module>;

  constructor(children: NodeInvokers<ModuleTranslatorChildren>, factory: IdentifiableFactory<ModuleNode, Module>, tree: DependencyManager<ModuleNode, Module>) {
    super(children);
    this.factory = factory;
    this.tree = tree;
  }

  translate(node: ModuleNode, context) {
    const module = this.tree.find(node.astRegion.source.reference) || (
      this.tree.dependency(
        this.factory.create(node.astRegion.source.reference),
      )
    );

    return module.identifiable;
  }
}
