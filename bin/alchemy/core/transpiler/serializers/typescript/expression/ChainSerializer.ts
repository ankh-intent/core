import { ChainNode, IdentifierNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export type ChainSerializerChildren = {
  identifier: IdentifierNode;
};

export class ChainSerializer extends NodeSerializer<ChainNode, ChainSerializerChildren> {
  serialize(node: ChainNode, context): string {
    return '.' + node.right.name;
  }
}
