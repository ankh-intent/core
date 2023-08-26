import { ReferenceNode } from '../../ast';
import { NodeSerializer } from '../NodeSerializer';
import { SerializingContext } from '../SerializingContext';

export type DomainReferenceSerializerChildren = {
    type: ReferenceNode;
};

export class DomainReferenceSerializer extends NodeSerializer<ReferenceNode, DomainReferenceSerializerChildren> {
    serialize(node: ReferenceNode, context: SerializingContext): string {
        return `${node.isArray ? 'Array<' : ''}${node.qualifier.path()}${this.serializeGeneric(node, context)}${node.isArray ? '>' : ''}`;
    }

    serializeGeneric(node: ReferenceNode, context: SerializingContext) {
        return (
            (node.generic && node.generic.genericTypes.length)
                ? `<${this.wrapInlineList(node.generic.genericTypes.map((child) => this.child.type(child, context)))}>`
                : ''
        );
    }
}
