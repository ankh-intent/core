import { Strings } from '@intent/utils';
import { DomainNode } from '../../transpiler/ast';
import { DomainRegistry } from '../DomainRegistry';
import { Functor } from '../functor';
import { DomainInterface, ReferenceInterface, GenericInterface } from '../interfaces';
import { Qualifier } from '../reference';

export class Domain extends DomainRegistry<DomainNode> implements DomainInterface {
  public qualifier: Qualifier;
  public parent?: ReferenceInterface;
  public generics: GenericInterface[] = [];
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

    const body = Strings.indent(String(parts.join('\n')).split('\n'), '  ').join('\n');

    return `domain ${this.qualifier}${
      this.generics.length ? `<${this.generics.join(', ')}>` : ''
    }${
      this.parent ? ` extends ${this.parent}` : ''
    } {${
      body.trim() ? `\n${body}\n` : ''
    }}`;
  }
}
