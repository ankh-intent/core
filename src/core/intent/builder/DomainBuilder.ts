
import { Tokens } from '../../parser/Tokens';
import { DomainNode } from '../ast/DomainNode';
import { TypeDefBuilder } from './TypeDefBuilder';
import { BaseBuilder } from './BaseBuilder';

export interface DomainChildren {
  typedef: TypeDefBuilder;
}

export class DomainBuilder extends BaseBuilder<DomainNode, DomainChildren> {
  public build(tokens: Tokens): DomainNode {
    tokens.ensure({value: 'domain'});

    let { value: identifier } = tokens.get({type: 'identifier'});
    let types = {};

    tokens.ensure({value: '{'});

    while (tokens.peek({value: 'type'})) {
      let type = this.child.typedef.build(tokens);

      if (type) {
        if (types[type.name]) {
          throw new Error(`Type with the same name "${type.name}" already present in current domain`);
        }

        types[type.name] = type;
      }
    }

    tokens.ensure({value: '}'});

    let domain = new DomainNode();
    domain.identifier = identifier;
    domain.types = types;

    return domain;
  }
}
