import { UsesNode, UseNode } from '../../ast';
import { NodeSerializer } from '../NodeSerializer';

export type UsesSerializerChildren = {
  use: UseNode;
};

export class UsesSerializer extends NodeSerializer<UsesNode, UsesSerializerChildren> {
  serialize(node: UsesNode, context): string {
    return this.wrap([
      node.entries.length && '// uses',
      ...node.entries.map(([alias, use]) => (
        `const ${alias} = ${this.child.use(use, context)};`
      )),
    ], { indent: false, surround: '' });
  }
}
