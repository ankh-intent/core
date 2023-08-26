import { CallableNode, FunctorNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type CallableLiteralSerializerChildren = {
    functor: FunctorNode;
};

export class CallableLiteralSerializer extends NodeSerializer<CallableNode, CallableLiteralSerializerChildren> {
    serialize(node: CallableNode, context: SerializingContext): string {
        return this.child.functor(node.functor, context);
    }
}
