import { ChainNode, IdentifierNode } from '@alchemy/ast';
import { NodeSerializer } from '../../NodeSerializer';

export type ChainSerializerChildren = {
    identifier: IdentifierNode;
};

export class ChainSerializer extends NodeSerializer<ChainNode, ChainSerializerChildren> {
    serialize(node: ChainNode): string {
        return '.' + node.right.name;
    }
}
