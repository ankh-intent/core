import { ReferenceNode } from '../../ast';
import { NodeSerializer } from '../NodeSerializer';

export type DomainInterfaceSerializerChildren = {
    type: ReferenceNode;
};

export class DomainInterfaceSerializer extends NodeSerializer<ReferenceNode, DomainInterfaceSerializerChildren> {
    serialize(node: ReferenceNode, context): string {
        return `${node.isArray ? 'Array<' : ''}${node.qualifier.path()}${this.serializeGeneric(node, context)}${node.isArray ? '>' : ''}`;
    }

    serializeGeneric(node: ReferenceNode, context) {
        return (
            (node.generic && node.generic.genericTypes.length)
                ? `<${this.wrapInlineList(node.generic.genericTypes.map((child) => this.child.type(child, context)))}>`
                : ''
        );
    }
}
