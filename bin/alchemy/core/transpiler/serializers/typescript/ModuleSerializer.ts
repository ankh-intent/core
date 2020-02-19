import { ModuleNode, DomainNode, UsesNode } from '../../ast';
import { NodeSerializer } from '../NodeSerializer';

export interface ModuleNodeSerializerChildren {
  uses: UsesNode;
  domain: DomainNode;
}

export class ModuleSerializer extends NodeSerializer<ModuleNode, ModuleNodeSerializerChildren> {
  serialize(node: ModuleNode): string {
    return `((Alchemy) => {${this.wrap([this.child.uses(node.uses), this.serializeReturn(node)])})(window['Alchemy']);`;
  }

  serializeReturn(node: ModuleNode): string {
    return `return {${this.wrap([`name: "${node.domain.identifier}",`, `domain: ${this.child.domain(node.domain)},`])}};`;
  }
}
