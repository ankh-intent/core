import { CallableNode, FunctorNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface CallableLiteralSerializerChildren {
  functor: FunctorNode;
}

export class CallableLiteralSerializer extends NodeSerializer<CallableNode, CallableLiteralSerializerChildren> {
  serialize(node: CallableNode): string {
    return this.child.functor(node.functor);
  }
}
