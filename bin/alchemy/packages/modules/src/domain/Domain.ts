import { Strings } from '@intent/kernel';
import { DomainNode } from '@alchemy/ast';
import { DomainInterface, ReferenceInterface, GenericInterface, DeclarationInterface } from '../interfaces';
import { DeclarationRegistry } from '../DeclarationRegistry';
import { Qualifier } from '../reference';
import { Interface } from './interface';
import { Functor, AssignmentStatement } from './functor';
import { Uses } from './use';
import { Trait } from './Trait';
import { Constraint } from './Constraint';
import { DomainModifier } from './DomainModifier';

export class Domain extends DeclarationRegistry<DomainNode> implements DomainInterface {
    public qualifier: Qualifier;
    public parent?: ReferenceInterface;
    public uses?: Uses;
    public ctor?: Functor;
    public intf?: Interface;
    public generics: GenericInterface[] = [];
    public modifier: DomainModifier = DomainModifier.create(this);
    public functors: Map<string, Functor> = new Map();
    public traits: Map<string, Trait> = new Map();
    public constraints: Set<Constraint> = new Set();
    public privates: Map<string, AssignmentStatement> = new Map();
    public inherits: boolean = false;

    public get identifier() {
        return this.qualifier.name;
    }

    static stub(name: string): Domain {
        return this.create((domain) => ({
            qualifier: Qualifier.create(domain, { name }),
        }))
    }

    getLocalDeclaration<D>(qualifier: Qualifier): (DeclarationInterface & D) | undefined {
        if (qualifier.name === 'self') {
            return this as this & D;
        }

        return super.getLocalDeclaration(qualifier);
    }

    inspectId(): boolean {
        return true;
    }

    toString() {
        const parts: string[] = [];
        const intf = (this.intf && String(this.intf) || '').trim();
        const constraints = (this.constraints.size ? [...this.constraints].map((v) => String(v)) : []);

        parts.push(...[...this].map((d) => String(d).trim()));

        if (this.uses) {
            const uses = Strings.indentStr(String(this.uses).trim(), '  ');

            if (uses) {
                parts.push(uses);
            }
        }

        if (this.traits.size) {
            parts.push(...[...this.traits].map(([, v]) => `${v};`));
        }

        if (constraints.length && !this.inherits) {
            parts.push(constraints.map((v) => `${v};`).join('\n'));
        }

        if (this.privates.size) {
            parts.push(...[...this.privates].map(([, v]) => `${v};`));
        }

        if (this.functors.size) {
            parts.push(...[...this.functors].map(([n, v]) => `${n}${v}`));
        }

        if (this.ctor) {
            parts.push(String(this.ctor));
        }

        const generics = this.generics.length ? `<${this.generics.join(', ')}>` : '';
        const parent = this.parent ? ` extends ${this.parent}` : '';
        const joined = Strings.indentStr(parts.join('\n').trim(), '  ');
        const body = `{${intf}${joined.trim() ? `\n${joined}\n` : ''}}`;
        const decl = this.inherits ? constraints.join(', ') + ' ' + body : body;

        return `${this.modifier}domain ${this.qualifier}${generics}${parent} ${decl}`;
    }
}
