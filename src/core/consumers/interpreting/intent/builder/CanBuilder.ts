
import { Tokens } from '../../../parsing/parser/Tokens';
import { BaseBuilder } from './BaseBuilder';
import { CanNode } from '../ast/CanNode';
import { PropertyBuilder } from './PropertyBuilder';
import { TypeBuilder } from './TypeBuilder';
import { TokenMatcher } from '../../parser/TokenMatcher';

export interface CanChildren {
  property: PropertyBuilder;
  type: TypeBuilder;
}

export class CanBuilder extends BaseBuilder<CanNode, CanChildren> {
  protected build(tokens: Tokens, matcher: TokenMatcher): CanNode {
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

      let arg = this.child.property.visit(tokens);

      if (arg) {
        if (args[arg.name]) {
          throw tokens.error(`Property with the same name "${arg.name}" already present`);
        }

        args[arg.name] = arg;
      } else {
        let token = tokens.get({});
        throw tokens.error(`")" or method argument expected, ${token ? `"${token.value}"` : 'EOF'} found`);
      }
    }

    tokens.ensure({type: 'symbol', value: ')'});

    if (tokens.get({type: 'symbol', value: ':'})) {
      returns = this.child.type.visit(tokens);
    }

    tokens.ensure({type: 'symbol', value: '{'});

    let token, body = [], prev = null;
    let wrapBefore = ['='];
    let wrapAfter = [',', '=', ':', '?'];
    let breakBefore = ['?', ':'];
    let breakAfter = [';'];

    while (token = tokens.except({type: 'symbol', value: '}'})) {
      if (prev === 'identifier') {
        if (token.type === prev) {
          body.push(' ');
        }
      }

      if (wrapBefore.indexOf(token.value) >= 0) {
        body.push(' ');
      }

      if (breakBefore.indexOf(token.value) >= 0) {
        body.push('\n  ');
      }

      if ((token.type === 'identifier') && (token.value === 'emit')) {
        body.push('yield');
      } else {
        body.push(token.raw);
      }

      if (breakAfter.indexOf(token.value) >= 0) {
        body.push('\n');
      }

      if (wrapAfter.indexOf(token.value) >= 0) {
        body.push(' ');
      }

      prev = token.type;
    }

    tokens.ensure({type: 'symbol', value: '}'});

    let can = new CanNode();
    can.name = name.value;
    can.args = args;
    can.returns = returns;
    can.body = body.join('');

    return can;
  }
}
