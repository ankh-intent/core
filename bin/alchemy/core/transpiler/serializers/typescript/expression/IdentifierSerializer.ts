import { IdentifierNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type IdentifierSerializerChildren = {};

export class IdentifierSerializer extends NodeSerializer<IdentifierNode, IdentifierSerializerChildren> {
    serialize(node: IdentifierNode, context: SerializingContext): string {
        return context.getLocalIdentifier(node.name) || `/* unknown */ ${node.name}`;
    }
}
