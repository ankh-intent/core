import { FunctorArgsNode, TypeNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface FunctorArgsSerializerChildren {
  type: TypeNode;
}

export class FunctorArgsSerializer extends NodeSerializer<FunctorArgsNode, FunctorArgsSerializerChildren> {
  serialize(node: FunctorArgsNode, context): string {
    for (const arg of node.args) {
      context.variables.set(arg.name, {
        local: `${context.getLocalIdentifier('arguments')}.$arg_${arg.name}`,
        type: arg.type,
      });
    }

    return this.wrapInlineList(node.args.map((arg) => `$arg_${arg.name}: ${this.child.type(arg.type, context)}`));
  }
}
