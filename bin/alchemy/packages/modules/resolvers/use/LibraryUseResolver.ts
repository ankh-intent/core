import { join } from 'node:path';

import { IdentifiableFactory } from '@intent/consumers';
import { PathsConfig } from '@intent/config';

import { QualifierNode, ModuleNode } from '@alchemy/ast';
import { Module } from '../../Module';
import { UseResolverInterface } from './UseResolverInterface';

export class LibraryUseResolver implements UseResolverInterface {
    private config: PathsConfig;
    private factory: IdentifiableFactory<ModuleNode, Module>;

    public constructor(config: PathsConfig, factory: IdentifiableFactory<ModuleNode, Module>) {
        this.config = config;
        this.factory = factory;
    }

    supports(from: Module, identifier: QualifierNode): boolean {
        return identifier.name === 'Alchemy';
    }

    public resolve(from: Module, identifier: QualifierNode): Module {
        const relative = identifier.path('/').toLowerCase().replace(/^alchemy[\/\\]/, '') + '.alc';
        const resolved = join(this.config.internal, relative);

        return this.factory.create(resolved);
    }
}
