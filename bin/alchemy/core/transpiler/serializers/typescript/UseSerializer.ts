import { UseNode } from '../../ast';
import { NodeSerializer } from '../NodeSerializer';

export type UseSerializerChildren = {};

export class UseSerializer extends NodeSerializer<UseNode, UseSerializerChildren> {
    serialize(node: UseNode, context): string {
        return `() => \`${node.decomposition.astRegion.extract().replace(/\n/g, ' ').replace(/\s*,\s*$/m, '')}\``;
    }
}
