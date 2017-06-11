
import { Tokens } from '../../parser/Tokens';
import { BaseBuilder } from './BaseBuilder';
import { CanNode } from '../ast/CanNode';
import { PropertyBuilder } from './PropertyBuilder';
import { TypeBuilder } from './TypeBuilder';

export interface CanChildren {
  property: PropertyBuilder;
  type: TypeBuilder;
}

export class CanBuilder extends BaseBuilder<CanNode, CanChildren> {
  public build(tokens: Tokens): CanNode {
    let name = tokens.get({type: 'identifier'});

    if (!name) {
      return null;
    }

    if (tokens.not({type: 'symbol', value: '('})) {
      return null;
    }

    let args = {};
    let returns = null;

    while (!tokens.peek({type: 'symbol', value: ')'})) {
      if (Object.keys(args).length) {
        tokens.ensure({type: 'symbol', value: ','})
      }

      let arg = this.child.property.build(tokens);

      if (arg) {
        if (args[arg.name]) {
          throw tokens.error(`Property with the same name "${arg.name}" already present`);
        }

        args[arg.name] = arg;
      }
    }

    tokens.ensure({type: 'symbol', value: ')'});

    if (tokens.get({type: 'symbol', value: ':'})) {
      returns = this.child.type.build(tokens);
    }

    tokens.ensure({type: 'symbol', value: '{'});

    let token, body = [];

    while (token = tokens.but({type: 'symbol', value: '}'})) {
      body.push(token.value);
    }

    tokens.ensure({type: 'symbol', value: '}'});

    let can = new CanNode();
    can.name = name.value;
    can.args = args;
    can.returns = returns;
    can.body = body.join(' ');

    return can;
  }
}
