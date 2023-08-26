import { Strings } from '@intent/utils';
import { PathsConfig } from '@intent/config';
import { IdentifiableFactory } from '@intent/consumers';

import { QualifierNode, ModuleNode } from '../../../transpiler';
import { Module } from '../../Module';
import { UseResolverInterface } from './UseResolverInterface';
import { LibraryUseResolver } from './LibraryUseResolver';

export class BaseUseResolver implements UseResolverInterface {
    private readonly config: PathsConfig;
    private readonly factory: IdentifiableFactory<ModuleNode, Module>;
    public resolvers: UseResolverInterface[];

    public constructor(config: PathsConfig, factory: IdentifiableFactory<ModuleNode, Module>) {
        this.config = config;
        this.factory = factory;
        this.resolvers = [
            new LibraryUseResolver(config, factory),
        ];
    }

    supports(from: Module, identifier: QualifierNode) {
        return true;
    }

    public resolve(from: Module, identifier: QualifierNode): Module {
        for (const resolver of this.resolvers) {
            if (resolver.supports(from, identifier)) {
                const found = resolver.resolve(from, identifier);

                if (found) {
                    return found;
                }
            }
        }

        const search = identifier.name;

        for (const found of Object.keys(from.linked).map((name) => from.linked[name])) {
            if (search === found.uri) {
                return identifier.child
                    ? this.resolve(found, identifier.child)
                    : found;
            }
        }

        const common = Strings.longestCommon([this.config.project, from.uri]).pop();
        const resolved = from.uri
            .replace(new RegExp(`^${common}`), '')
            .replace(/\/[^\/]+$/, '/') + search.toLowerCase() + '.alc'
        ;

        return this.factory.create(common + resolved);
    }
}
