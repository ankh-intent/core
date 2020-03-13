import { UsesNode, UseNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type UsesTranslatorChildren = {
  use: UseNode;
};

export class UsesTranslator extends NodeTranslator<UsesNode, UsesTranslatorChildren> {
  translate(node: UsesNode, context): string {
    return this.wrap([
      node.entries.length && '// uses',
      ...node.entries.map(([alias, use]) => (
        `const ${alias} = ${this.child.use(use, context)};`
      )),
    ], { indent: false, surround: '' });
  }
}
