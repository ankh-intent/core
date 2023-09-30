import { UseNode } from '@alchemy/ast';
import { NodeSerializer } from '../NodeSerializer';

export type UseSerializerChildren = {};

export class UseSerializer extends NodeSerializer<UseNode, UseSerializerChildren> {
    serialize(node: UseNode): string {
        return `() => \`${node.decomposition.astRegion.extract().replace(/\n/g, ' ').replace(/\s*,\s*$/m, '')}\``;
    }
}
