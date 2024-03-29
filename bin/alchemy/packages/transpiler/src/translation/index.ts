import { IdentifiableFactory } from '@intent/consumers';
import { DependencyManager } from '@intent/kernel';
import { RootTranslator } from '@intent/translator';

import { Module } from '@alchemy/modules';
import { ModuleNode } from '@alchemy/ast';

import { ModuleTranslatorChildren, ModuleTranslator } from './ModuleTranslator';
import { UseInvokers, factory as useTranslatorsFactory } from './use';
import { DomainInvokers, factory as domainTranslatorsFactory } from './domain';
import { FunctorInvokers, factory as functorTranslatorsFactory } from './functor';

type AlchemyGrammar =
    UseInvokers &
    DomainInvokers &
    FunctorInvokers &
    ModuleTranslatorChildren
;

export class AlchemyTranslator extends RootTranslator<ModuleNode, AlchemyGrammar> {
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
            ...useTranslatorsFactory(this.invokers),
            ...domainTranslatorsFactory(this.invokers),
            ...functorTranslatorsFactory(this.invokers),
        };
    }
}
