import { DependencyManager } from '@intent/kernel';
import { NodeInvokers } from '@intent/plugins';
import { IdentifiableFactory } from '@intent/consumers';
import { TranslationContext } from '@intent/translator';

import { ModuleNode, DomainNode, UsesNode } from '@alchemy/ast';
import { Module } from '@alchemy/modules';
import { AlchemyNodeTranslator } from './AlchemyNodeTranslator';

export type ModuleTranslatorChildren = {
    uses: UsesNode;
    domain: DomainNode;
}

export class ModuleTranslator extends AlchemyNodeTranslator<Module, ModuleTranslatorChildren> {
    private readonly factory: IdentifiableFactory<ModuleNode, Module>;
    private readonly modules: DependencyManager<ModuleNode, Module>;

    constructor(
        children: NodeInvokers<ModuleTranslatorChildren>,
        factory: IdentifiableFactory<ModuleNode, Module>,
        modules: DependencyManager<ModuleNode, Module>
    ) {
        super(children);
        this.factory = factory;
        this.modules = modules;
    }

    translate(node: ModuleNode, context: TranslationContext<any>) {
        const { identifiable: module } = this.modules.find(node.identifier) || (
            this.modules.dependency(
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
