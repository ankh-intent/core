import { DomainNode, FunctorNode, UsesNode, TypeNode } from '../../ast';
import { NodeSerializer } from '../NodeSerializer';

export interface DomainSerializerChildren {
  uses: UsesNode;
  type: TypeNode;
  domain: DomainNode;
  functor: FunctorNode;
}

export class DomainSerializer extends NodeSerializer<DomainNode, DomainSerializerChildren> {
  serialize(node: DomainNode, context): string {
    const sub = context.nest();

    return `(() => {${this.wrap([
      this.child.uses(node.uses, sub),
      this.serializeDomains(node, sub),
      this.serializeConstructor(node, sub),
      this.serializeMethods(node, sub),
      this.serializeReturn(node, sub),
    ])}})()`;
  }

  serializeDomains(node: DomainNode, context) {
    return node.domains.size && this.wrapStatements([
      this.wrapStatements(
        [...node.domains.entries()]
          .map(([alias, domain]) => `const Domain_${alias} = ${this.child.domain(domain, context)};`)
      ),
    ]);
  }

  serializeReturn(node: DomainNode, context) {
    return `return {${this.wrap([
      node.domains.size && `domains: {${this.wrapInlineList(
        [...node.domains.keys()].map((alias) => `${alias}: Domain_${alias}`)
      )}},`,
      `ctor,`
    ])}};`;
  }

  serializeConstructor(node: DomainNode, context) {
    if (node.parent) {
      if (node.ctor) {
        return this.wrapStatements([
          `const ctor_1 = ${this.child.functor(node.ctor, context)};`,
          `const ctor = (...params: any[]) => ctor_1(${this.child.type(node.parent, context)}(params));`
        ]);
      } else {
        return `const ctor = (...params: any[]) => ${this.child.type(node.parent, context)}(params);`
      }
    } else {
      if (node.ctor) {
        return `const ctor = ${this.child.functor(node.ctor, context)};`;
      } else {
        return 'const ctor = (...params: any[]) => params;';
      }
    }
  }

  serializeMethods(node: DomainNode, context) {
    return node.methods.size && this.wrapStatements(
      [...node.methods.entries()]
        .map(([name, method]) => `const $method_${name} = ${this.child.functor(method, context)};`)
    );
  }
}
