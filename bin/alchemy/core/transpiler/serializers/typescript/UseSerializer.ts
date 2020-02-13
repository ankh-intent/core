import { UseNode } from '../../ast';
import { NodeSerializer } from '../NodeSerializer';

export interface UseSerializerChildren {
}

export class UseSerializer extends NodeSerializer<UseNode, UseSerializerChildren> {
  serialize(node: UseNode): string {
    return `() => \`${node.decomposition.astRegion.extract().replace(/\n/g, ' ').replace(/\s*,\s*$/m, '')}\``;
  }
}
