import { ModuleNode, DomainNode, UsesNode } from '../../ast';
import { NodeSerializer } from '../NodeSerializer';

export interface ModuleNodeSerializerChildren {
  uses: UsesNode;
  domain: DomainNode;
}

export class ModuleSerializer extends NodeSerializer<ModuleNode, ModuleNodeSerializerChildren> {
  serialize(node: ModuleNode): string {
    return `
      ((Alchemy) => {
        ${this.child.uses(node.uses)}

        return {
          name: "${node.domain.identifier}",
          domain: ${this.child.domain(node.domain)},
        };
      })(window['Alchemy']);
    `;
  }
}
