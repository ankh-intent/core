import { FunctorNode, FunctorArgsNode, FunctorBodyNode, TypeNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface FunctorSerializerChildren {
  args: FunctorArgsNode;
  type: TypeNode;
  functor_body: FunctorBodyNode;
}

export class FunctorSerializer extends NodeSerializer<FunctorNode, FunctorSerializerChildren> {
  serialize(node: FunctorNode, context): string {
    const localArgs = `$args_${context.depth}`;

    context.variables.set('arguments', {
      local: localArgs,

    });

    return `(${localArgs}: {${this.child.args(node.args, context)}})${node.returns ? `: ${this.child.type(node.returns, context)}` : ''} => ${
      this.child.functor_body(node.body, context)
    }`;
  }
}
