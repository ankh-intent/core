
import { ChipNode } from './ast/ChipNode';
import { CanNode } from './ast/CanNode';
import { UseNode } from './ast/UseNode';
import { DomainNode } from './ast/DomainNode';
import { Tokens } from './parser/Tokens';
import { QualifierNode } from './ast/QualifierNode';

export class ASTBuilder {

  public chip(tokens: Tokens): ChipNode {
    tokens.ensure({value: 'chip'});

    let { value: name } = tokens.ensure({type: 'string'});

    let chip = new ChipNode();
    chip.name = name;

    let domains = [];

    tokens.ensure({value: '{'});

    while (true) {
      let use = this.use(tokens);

      if (use) {
        if (chip.uses[use.alias]) {
          throw new Error(`Use with same alias "${use.alias}" already present`);
        }

        chip.uses[use.alias] = use;
      } else {
        let domain = this.domain(tokens);

        if (domain) {
          domains.push(domain);
        } else {
          break;
        }
      }
    }

    let can = this.can(tokens);

    tokens.ensure({value: '}'});

    for (let domain of domains) {
      chip.domains[domain.name] = domain;
    }

    chip.can = can;

    return chip;
  }

  public use(tokens: Tokens): UseNode {
    if (tokens.not({value: 'use'})) {
      return null;
    }

    let qualifier = this.qualifier(tokens);
    let alias = qualifier.deepest();

    if (tokens.get({value: 'as'})) {
      alias = tokens.ensure({type: 'identifier'}).value;
    }

    tokens.ensure({type: 'symbol', value: ';'});

    let use = new UseNode();
    use.qualifier = qualifier;
    use.alias = alias;

    return use;
  }

  public qualifier(tokens: Tokens): QualifierNode {
    let { value: name } = tokens.ensure({type: 'identifier'});

    let qualifier = new QualifierNode();
    qualifier.name = name;

    if (tokens.get({value: '.', type: 'symbol'})) {
      qualifier.child = this.qualifier(tokens);
    }

    return qualifier;
  }

  public domain(tokens: Tokens): DomainNode {
    let domain = new DomainNode();
    domain = null;
    return domain;
  }

  public can(tokens: Tokens): CanNode {
    if (tokens.not({value: 'can'})) {
      return null;
    }

    let can = new CanNode();
    can = null;
    return can;
  }

}


