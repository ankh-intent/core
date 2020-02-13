import { DomainNode, FunctorNode, UsesNode } from '../../ast';
import { NodeSerializer } from '../NodeSerializer';

export interface DomainSerializerChildren {
  uses: UsesNode;
  domain: DomainNode;
  functor: FunctorNode;
}

export class DomainSerializer extends NodeSerializer<DomainNode, DomainSerializerChildren> {
  serialize(node: DomainNode): string {
    return `(() => {
        ${this.child.uses(node.uses)}
        ${this.serializeDomains(node)}

        return {
          domains,
          ctor: ${node.ctor ? this.child.functor(node.ctor) : '() => {}'},
        };
      })()
    `;
  }

  serializeDomains(node: DomainNode) {
    return `
    const domains = {
    ${[...node.domains.entries()].map(([alias, domain]) => (
      `    ${alias}: ${this.child.domain(domain)},`
    )).join('\n    ')}
    };
    `;
  }
}
