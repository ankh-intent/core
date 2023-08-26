import { ModuleNode, DomainNode, UsesNode } from '../../ast';
import { NodeSerializer } from '../NodeSerializer';
import { SerializingContext } from '../SerializingContext';

export type ModuleNodeSerializerChildren = {
    uses: UsesNode;
    domain: DomainNode;
};

export class ModuleSerializer extends NodeSerializer<ModuleNode, ModuleNodeSerializerChildren> {
    serialize(node: ModuleNode, context: SerializingContext): string {
        const sub = context.nest();

        return `((Alchemy) => {${this.wrap([this.child.uses(node.uses, sub), this.serializeReturn(node, sub)])})(window['Alchemy']);`;
    }

    serializeReturn(node: ModuleNode, context: SerializingContext): string {
        return `return {${this.wrap([`name: "${node.domain.identifier}",`, `domain: ${this.child.domain(node.domain, context)},`])}};`;
    }
}
