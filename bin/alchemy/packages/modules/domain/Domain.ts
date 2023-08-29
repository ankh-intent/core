import { Strings } from '@intent/kernel';
import { DomainNode } from '@alchemy/ast';
import { DomainInterface, ReferenceInterface, GenericInterface } from '../interfaces';
import { DeclarationRegistry } from '../DeclarationRegistry';
import { Qualifier } from '../reference';
import { Interface } from './interface';
import { Functor, AssignmentStatement } from './functor';
import { Uses } from './use';
import { Trait } from './Trait';
import { Constraint } from './Constraint';
import { DomainModifier } from './DomainModifier';

export class Domain extends DeclarationRegistry<DomainNode> implements DomainInterface {
    public modifier: DomainModifier;
    public qualifier: Qualifier;
    public parent?: ReferenceInterface;
    public generics: GenericInterface[] = [];
    public intf: Interface;
    public uses: Uses;
    public ctor?: Functor;
    public functors: Map<string, Functor> = new Map();
    public traits: Map<string, Trait> = new Map();
    public constraints: Set<Constraint> = new Set();
    public privates: Map<string, AssignmentStatement> = new Map();
    public inherits: boolean = false;

    public get identifier() {
        return this.qualifier.name;
    }

    inspectId(): boolean {
        return true;
    }

    toString() {
        const parts: string[] = [];

        parts.push(...[...this].map((d) => String(d)));

        if (this.traits.size) {
            parts.push(...[...this.traits].map(([, v]) => `${v};`));
        }

        if (this.constraints.size) {
            parts.push(...[...this.constraints].map((v) => `${v};`));
        }

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

        return `${this.modifier}domain ${this.qualifier}${
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
