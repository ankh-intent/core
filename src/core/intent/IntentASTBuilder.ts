
import { Tokens } from '../parser/Tokens';
import { ASTBuilder } from '../ASTBuilder';

import { ChipNode } from '../ast/ChipNode';
import { CanNode } from '../ast/CanNode';
import { UseNode } from '../ast/UseNode';
import { DomainNode } from '../ast/DomainNode';
import { QualifierNode } from '../ast/QualifierNode';
import { TypeNode } from '../ast/TypeNode';
import { TypeDefNode } from '../ast/TypeDefNode';
import { PropertyNode } from '../ast/PropertyNode';

export class IntentASTBuilder implements ASTBuilder<ChipNode> {

  public build(tokens: Tokens): ChipNode {
    return this.chip(tokens);
  }

  public chip(tokens: Tokens): ChipNode {
    tokens.ensure({value: 'chip'});

    let { value: name } = tokens.ensure({type: 'string'});

    let uses = {};
    let domains = {};

    tokens.ensure({value: '{'});

    while (true) {
      if (tokens.peek({type: 'symbol', value: '}'})) {
        break;
      }

      let use = this.use(tokens);

      if (use) {
        if (uses[use.alias]) {
          throw new Error(`Use with same alias "${use.alias}" already present`);
        }

        uses[use.alias] = use;
      } else {
        let domain = this.domain(tokens);

        if (domain) {
          if (domains[domain.identifier]) {
            throw new Error(`Use with same alias "${domain.identifier}" already present`);
          }

          domains[domain.identifier] = domain;
        } else {
          break;
        }
      }
    }

    let can = this.can(tokens);

    tokens.ensure({value: '}'});

    let chip = new ChipNode();
    chip.name = name;
    chip.uses = uses;
    chip.domains = domains;
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
    tokens.ensure({value: 'domain'});

    let { value: identifier } = tokens.get({type: 'identifier'});
    let types = {};

    tokens.ensure({value: '{'});

    while (tokens.peek({value: 'type'})) {
      let type = this.typedef(tokens);

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

  public typedef(tokens: Tokens): TypeDefNode {
    if (tokens.not({value: 'type'})) {
      return null;
    }

    let { value: name } = tokens.get({type: 'identifier'});
    let parent = null;
    let properties = {};

    if (tokens.get({value: 'extends'})) {
      parent = this.type(tokens);
    }

    tokens.ensure({value: '{'});

    while (true) {
      let property = this.property(tokens);

      if (property) {
        if (properties[property.name]) {
          throw new Error(`Property with the same name "${property.name}" already present`);
        }

        properties[property.name] = property;
      } else {
        break;
      }
    }

    tokens.ensure({value: '}'});

    let type = new TypeDefNode();
    type.name = name;
    type.parent = parent;
    type.properties = properties;

    return type;
  }

  public property(tokens: Tokens): PropertyNode {
    let name = tokens.get({type: 'identifier'});

    if (!name) {
      return null;
    }

    tokens.ensure({type: 'symbol', value: ':'});

    let type = this.type(tokens);

    tokens.ensure({type: 'symbol', value: ';'});

    let property = new PropertyNode();
    property.name = name.value;
    property.type = type;

    return property;
  }

  public can(tokens: Tokens): CanNode {
    if (tokens.not({value: 'can'})) {
      return null;
    }

    let can = new CanNode();
    can = null;
    return can;
  }


  public type(tokens: Tokens): TypeNode {
    let qualifier = this.qualifier(tokens);
    let generic = null;

    if (tokens.get({type: 'symbol', value: '<'})) {
      generic = this.type(tokens);
      tokens.ensure({type: 'symbol', value: '>'});
    }

    let type = new TypeNode();
    type.qualifier = qualifier;
    type.generic = generic;

    return type;
  }

}
