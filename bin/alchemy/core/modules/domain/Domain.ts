import { Strings } from '@intent/utils';
import { DomainNode } from '../../transpiler';
import { DomainInterface, ReferenceInterface, GenericInterface } from '../interfaces';
import { DeclarationRegistry } from '../DeclarationRegistry';
import { Functor } from './functor';
import { Qualifier } from '../reference';
import { Interface } from './interface';
import { Uses } from './use';

export class Domain extends DeclarationRegistry<DomainNode> implements DomainInterface {
    public qualifier: Qualifier;
    public parent?: ReferenceInterface;
    public generics: GenericInterface[] = [];
    public intf: Interface;
    public uses: Uses;
    public ctor?: Functor;
    public functors: Map<string, Functor> = new Map();

    public get identifier() {
        return this.qualifier.name;
    }

    toString() {
        const parts: string[] = [];

        parts.push(...[...this].map((d) => String(d)));

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
