import { UsesNode, UseNode } from '../../ast';
import { NodeSerializer } from '../NodeSerializer';

export interface UsesSerializerChildren {
  use: UseNode;
}

export class UsesSerializer extends NodeSerializer<UsesNode, UsesSerializerChildren> {
  serialize(node: UsesNode): string {
    return `
    // uses
    ${node.entries.map(([alias, use]) => (
      `const ${alias} = ${this.child.use(use)};`
    )).join('\n    ')}
    `;
  }
}
