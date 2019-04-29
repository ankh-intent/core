import { BaseBuilder, BuildInvoker } from '@intent/kernel/transpiler/BaseBuilder';
import { AlchemyBuildInvokers } from '../Alchemy';

import { CanNode } from '../ast/CanNode';
import { TypeNode } from '../ast/TypeNode';
import { PropertyNode } from '../ast/PropertyNode';

export interface CanChildren extends AlchemyBuildInvokers {
  property: BuildInvoker<PropertyNode>;
  type: BuildInvoker<TypeNode>;
}

export class CanBuilder extends BaseBuilder<CanNode, any, CanChildren> {
  protected build(tokens, { peek, not, get, except, ensure }): CanNode {
    const name = get.identifier();

    if (!name) {
      return null;
    }

    if (not.symbol('(')) {
      return null;
    }

    const args = {};
    let returns = null;

    while (!peek.symbol(')')) {
      if (Object.keys(args).length) {
        ensure.symbol(',');
      }

      const arg = this.child.property(tokens);

      if (arg) {
        if (args[arg.name]) {
          throw tokens.error(`Property with the same name "${arg.name}" already present`);
        }

        args[arg.name] = arg;
      } else {
        const token = get.any();
        throw tokens.error(`")" or method argument expected, ${token ? `"${token.value}"` : 'EOF'} found`);
      }
    }

    ensure.symbol(')');

    if (get.symbol(':')) {
      returns = this.child.type(tokens);
    }

    ensure.symbol('{');

    const wrapBefore = ['='];
    const wrapAfter = [',', '=', ':', '?', 'return'];
    const breakBefore = ['?', ':'];
    const breakAfter = [';'];
    const body = [];
    let token;
    let prev = null;

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

    const can = new CanNode();
    can.name = name.value;
    can.args = args;
    can.returns = returns;
    can.body = body.join('');

    return can;
  }
}
