import { FunctorNode, FunctorArgsNode, FunctorBodyNode, ReferenceNode } from '@alchemy/ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type FunctorSerializerChildren = {
    args: FunctorArgsNode;
    type: ReferenceNode;
    functor_body: FunctorBodyNode;
};

export class FunctorSerializer extends NodeSerializer<FunctorNode, FunctorSerializerChildren> {
    serialize(node: FunctorNode, context: SerializingContext): string {
        const sub = context.nest();
        const { local } = sub.argsType(node.args);

        return `(${local}: ${this.child.args(node.args, sub)})${node.returns ? `: ${this.child.type(node.returns, sub)}` : ''} => ${
            this.child.functor_body(node.body, sub)
        }`;
    }
}
