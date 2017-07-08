
import { TokenMatcher } from '../../../parsing/parser/TokenMatcher';
import { Tokens } from '../../../parsing/parser/Tokens';
import { BaseBuilder, BuildInvoker } from './BaseBuilder';
import { CanNode } from '../ast/CanNode';
import { TypeNode } from '../ast/TypeNode';
import { PropertyNode } from '../ast/PropertyNode';

export interface CanChildren {
  property: BuildInvoker<PropertyNode>;
  type: BuildInvoker<TypeNode>;
}

export class CanBuilder extends BaseBuilder<CanNode, CanChildren> {
  protected build(tokens: Tokens, {peek, not, get, except, ensure}: TokenMatcher): CanNode {
    let name = get.identifier();

    if (!name) {
      return null;
    }

    if (not.symbol('(')) {
      return null;
    }

    let args = {};
    let returns = null;

    while (!peek.symbol(')')) {
      if (Object.keys(args).length) {
        ensure.symbol(',');
      }

      let arg = this.child.property(tokens);

      if (arg) {
        if (args[arg.name]) {
          throw tokens.error(`Property with the same name "${arg.name}" already present`);
        }

        args[arg.name] = arg;
      } else {
        let token = get.any();
        throw tokens.error(`")" or method argument expected, ${token ? `"${token.value}"` : 'EOF'} found`);
      }
    }

    ensure.symbol(')');

    if (get.symbol(':')) {
      returns = this.child.type(tokens);
    }

    ensure.symbol('{');

    let token, body = [], prev = null;
    let wrapBefore = ['='];
    let wrapAfter = [',', '=', ':', '?'];
    let breakBefore = ['?', ':'];
    let breakAfter = [';'];

    while ((token = except.symbol('}'))) {
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

    ensure.symbol('}');

    let can = new CanNode();
    can.name = name.value;
    can.args = args;
    can.returns = returns;
    can.body = body.join('');

    return can;
  }
}
