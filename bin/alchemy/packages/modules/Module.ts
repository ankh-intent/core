import { Strings, Container } from '@intent/utils';
import { Identifiable, TreeNode } from '@intent/kernel';

import { ModuleNode } from '@alchemy/ast';
import { Domain, Uses } from './domain';
import { Qualifier } from './reference';
import { DeclarationRegistry } from './DeclarationRegistry';

export class Module extends DeclarationRegistry<ModuleNode> implements Identifiable<ModuleNode> {
    public uri: string;
    public qualifier: Qualifier;
    public linked: Container<Module> = {};
    public domain: Domain;
    public uses: Uses;

    constructor(uri: string, qualifier: Qualifier) {
        super();
        this.uri = uri;
        this.qualifier = qualifier;
    }

    public get identifier() {
        return this.qualifier.path();
    }

    public get children(): (TreeNode | Module)[] {
        return [this.ast!, ...Object.values(this.linked)].filter(Boolean);
    }

    toString() {
        return `${this.uses}\nmodule "${this.identifier}" {\n${
            Strings.indent(String(this.domain).split('\n'), '  ').join('\n')
        }\n}`;
    }
}
