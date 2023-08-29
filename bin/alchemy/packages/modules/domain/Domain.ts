import { Strings } from '@intent/kernel';
import { DomainNode, AssignmentStatementNode } from '@alchemy/ast';
import { DomainInterface, ReferenceInterface, GenericInterface } from '../interfaces';
import { DeclarationRegistry } from '../DeclarationRegistry';
import { Qualifier } from '../reference';
import { Interface } from './interface';
import { Functor, AssignmentStatement } from './functor';
import { Uses } from './use';

export class Domain extends DeclarationRegistry<DomainNode> implements DomainInterface {
    public qualifier: Qualifier;
    public parent?: ReferenceInterface;
    public generics: GenericInterface[] = [];
    public intf: Interface;
    public uses: Uses;
    public ctor?: Functor;
    public functors: Map<string, Functor> = new Map();
    public privates: Map<string, AssignmentStatement> = new Map();
    public inherits: boolean = false;

    public get identifier() {
        return this.qualifier.name;
    }

    toString() {
        const parts: string[] = [];

        parts.push(...[...this].map((d) => String(d)));

        if (this.privates.size) {
            parts.push(...[...this.privates].map(([n, v]) => `${v};`));
        }

        if (this.functors.size) {
            parts.push(...[...this.functors].map(([n, v]) => `${n}${v}`));
        }

        if (this.ctor) {
            parts.push(String(this.ctor));
        }

        const uses = Strings.indent(String(this.uses).split('\n'), '  ').join('\n');
        const body = Strings.indent(String(parts.join('\n')).split('\n'), '  ').join('\n');

        return `domain ${this.qualifier}${
            this.generics.length ? `<${this.generics.join(', ')}>` : ''
        }${
            this.parent ? ` extends ${this.parent}` : ''
        } {${
            this.intf
        }${
            uses.trim() ? `\n${uses}\n` : ''
        }${
            body.trim() ? `\n${body}\n` : ''
        }}`;
    }
}