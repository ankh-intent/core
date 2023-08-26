import { NodeInvokers } from '@intent/plugins';
import { IdentifiableFactory } from '@intent/consumers';
import { DependencyManager } from '@intent/kernel';

import { Module } from '../../../modules';
import { ModuleNode, DomainNode, UsesNode } from '../../ast';
import { NodeTranslator } from '../NodeTranslator';
import { TranslationContext } from '../TranslationContext';

export type ModuleTranslatorChildren = {
    uses: UsesNode;
    domain: DomainNode;
}

export class ModuleTranslator extends NodeTranslator<Module, ModuleTranslatorChildren> {
    private readonly factory: IdentifiableFactory<ModuleNode, Module>;
    private readonly tree: DependencyManager<ModuleNode, Module>;

    constructor(
        children: NodeInvokers<ModuleTranslatorChildren>,
        factory: IdentifiableFactory<ModuleNode, Module>,
        tree: DependencyManager<ModuleNode, Module>
    ) {
        super(children);
        this.factory = factory;
        this.tree = tree;
    }

    translate(node: ModuleNode, context: TranslationContext<any>) {
        const { identifiable: module } = this.tree.find(node.identifier) || (
            this.tree.dependency(
                this.factory.create(node.identifier),
            )
        );
        const inner = context.nest({
            parent: module,
        });
        module.parentNode = context.parent;
        module.ast = node;
        module.uses = this.child.uses(node.uses, inner);
        module.domain = this.child.domain(node.domain, inner);

        return module;
    }
}
