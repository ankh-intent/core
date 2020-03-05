import { FunctorNode, FunctorArgsNode, FunctorBodyNode, TypeNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface FunctorSerializerChildren {
  args: FunctorArgsNode;
  type: TypeNode;
  functor_body: FunctorBodyNode;
}

export class FunctorSerializer extends NodeSerializer<FunctorNode, FunctorSerializerChildren> {
  serialize(node: FunctorNode, context): string {
    const sub = context.nest();
    const { local } = sub.argsType(node.args);

    return `(${local}: ${this.child.args(node.args, sub)})${node.returns ? `: ${this.child.type(node.returns, sub)}` : ''} => ${
      this.child.functor_body(node.body, sub)
    }`;
  }
}
