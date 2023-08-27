import { UsesNode, UseNode } from '@alchemy/ast';
import { NodeSerializer } from '../NodeSerializer';
import { SerializingContext } from '../SerializingContext';

export type UsesSerializerChildren = {
    use: UseNode;
};

export class UsesSerializer extends NodeSerializer<UsesNode, UsesSerializerChildren> {
    serialize(node: UsesNode, context: SerializingContext): string {
        return this.wrap([
            node.entries.length && '// uses',
            ...node.entries.map(([alias, use]) => (
                `const ${alias} = ${this.child.use(use, context)};`
            )),
        ], { indent: false, surround: '' });
    }
}
