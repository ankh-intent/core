import { FunctorNode, FunctorArgsNode, FunctorBodyNode, TypeNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface FunctorSerializerChildren {
  args: FunctorArgsNode;
  type: TypeNode;
  functor_body: FunctorBodyNode;
}

export class FunctorSerializer extends NodeSerializer<FunctorNode, FunctorSerializerChildren> {
  serialize(node: FunctorNode): string {
    return `($args: {${this.child.args(node.args)}})${node.returns ? `: ${this.child.type(node.returns)}` : ''} => ${
      this.child.functor_body(node.body)
    }`;
  }
}
