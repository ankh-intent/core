import { FunctorArgsNode, ReferenceNode } from '@alchemy/ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type FunctorArgsSerializerChildren = {
    type: ReferenceNode;
};

export class FunctorArgsSerializer extends NodeSerializer<FunctorArgsNode, FunctorArgsSerializerChildren> {
    serialize(node: FunctorArgsNode, context: SerializingContext): string {
        return `{${this.wrapInlineList(
            node.args.map((arg) => `${arg.name}: ${this.child.type(arg.type, context)}`),
            ', ',
            ' ',
        )}}`;
    }
}
