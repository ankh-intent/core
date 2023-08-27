import { DomainNode, FunctorNode, UsesNode, ReferenceNode } from '@alchemy/ast';
import { NodeSerializer } from '../NodeSerializer';
import { SerializingContext } from '../SerializingContext';

export type DomainSerializerChildren = {
    uses: UsesNode;
    type: ReferenceNode;
    domain: DomainNode;
    functor: FunctorNode;
};

export class DomainSerializer extends NodeSerializer<DomainNode, DomainSerializerChildren> {
    serialize(node: DomainNode, context: SerializingContext): string {
        const sub = context.nest();
        const local = `$${node.identifier.toLowerCase()}_domain_${context.depth}_${context.types.size}`;
        const { type, domainType } = context.domainType(node);

        sub.variables.set('this', {
            local,
            type,
        });
        sub.variables.set(node.identifier, {
            local: `Domain_${node.identifier}`,
            type: domainType,
        });

        return `(() => {${this.wrap([
            `const ${local} = ${node.parent && node.parent.isArray ? '[]' : '{}'};`,
            this.child.uses(node.uses, sub),
            this.serializeDomains(node, sub),
            this.serializeConstructor(node, sub),
            this.serializeMethods(node, sub),
            this.serializeReturn(node, sub),
        ])}})()`;
    }

    serializeDomains(node: DomainNode, context: SerializingContext) {
        return node.domains.size && this.wrapStatements([
            this.wrapStatements(
                [...node.domains.entries()]
                    .map(([alias, domain]) => `const ${context.getLocalIdentifier(alias)} = ${this.child.domain(domain, context)};`),
            ),
        ]);
    }

    serializeReturn(node: DomainNode, _context: SerializingContext) {
        return `return {${this.wrap([
            `name: "${node.identifier}",`,
            node.domains.size && `domains: {${this.wrapInlineList(
                [...node.domains.keys()].map((alias) => `${alias}: Domain_${alias}`),
            )}},`,
            `ctor,`,
        ])}};`;
    }

    serializeConstructor(node: DomainNode, context: SerializingContext) {
        if (node.parent) {
            if (node.ctor) {
                return this.wrapStatements([
                    `const ctor_1 = ${this.child.functor(node.ctor, context)};`,
                    `const ctor = (...params: any[]) => ctor_1(${this.child.type(node.parent, context)}(params));`,
                ]);
            } else {
                return `const ctor = (...params: any[]) => ${this.child.type(node.parent, context)}(params);`;
            }
        } else {
            if (node.ctor) {
                return `const ctor = ${this.child.functor(node.ctor, context)};`;
            } else {
                return 'const ctor = (...params: any[]) => params;';
            }
        }
    }

    serializeMethods(node: DomainNode, context: SerializingContext) {
        for (const [name, entry] of node.methods.entries()) {
            context.variables.set(name, {
                local: `$method_${name}`,
                type: context.functorType(entry),
            });
        }

        return node.methods.size && this.wrapStatements(
            [...node.methods.entries()]
                .map(([name, method]) => `const ${context.getLocalIdentifier(name)} = ${this.child.functor(method, context)};`),
        );
    }
}
