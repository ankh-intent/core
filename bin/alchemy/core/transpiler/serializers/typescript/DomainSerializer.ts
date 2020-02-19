import { DomainNode, FunctorNode, UsesNode, TypeNode } from '../../ast';
import { NodeSerializer } from '../NodeSerializer';

export interface DomainSerializerChildren {
  uses: UsesNode;
  type: TypeNode;
  domain: DomainNode;
  functor: FunctorNode;
}

export class DomainSerializer extends NodeSerializer<DomainNode, DomainSerializerChildren> {
  serialize(node: DomainNode): string {
    return `(() => {${this.wrap([
      this.child.uses(node.uses),
      this.serializeDomains(node),
      this.serializeConstructor(node),
      this.serializeReturn(node),
    ])}})()`;
  }

  serializeDomains(node: DomainNode) {
    return node.domains.size && this.wrapStatements([
      this.wrapStatements(
        [...node.domains.entries()]
          .map(([alias, domain]) => `const Domain_${alias} = ${this.child.domain(domain)};`)
      ),
    ]);
  }

  serializeReturn(node: DomainNode) {
    return `return {${this.wrap([
      node.domains.size && `domains: {${this.wrapInlineList(
        [...node.domains.keys()].map((alias) => `${alias}: Domain_${alias}`)
      )}},`,
      `ctor,`
    ])}};`;
  }

  serializeConstructor(node: DomainNode) {
    if (node.parent) {
      if (node.ctor) {
        return this.wrapStatements([
          `const ctor_1 = ${this.child.functor(node.ctor)};`,
          `const ctor = (...params: any[]) => ctor_1(${this.child.type(node.parent)}(params));`
        ]);
      } else {
        return `const ctor = (...params: any[]) => ${this.child.type(node.parent)}(params);`
      }
    } else {
      if (node.ctor) {
        return `const ctor = ${this.child.functor(node.ctor)};`;
      } else {
        return 'const ctor = (...params: any[]) => params;';
      }
    }
  }
}
