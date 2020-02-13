import { FunctorNode, FunctorArgsNode, FunctorBodyNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface FunctorSerializerChildren {
  args: FunctorArgsNode;
  block: FunctorBodyNode;
}

export class FunctorSerializer extends NodeSerializer<FunctorNode, FunctorSerializerChildren> {
  serialize(node: FunctorNode): string {
    return `(${this.child.args(node.args)})${node.returns ? `: ${node.returns}` : ''} => {
       ${this.child.block(node.body)}
     }`;
  }
}
