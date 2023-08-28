import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import {
    DomainNode,
    UsesNode,
    FunctorNode,
    ReferenceNode,
    EnumNode,
    ExpressionNode,
    DomainInterfaceNode,
    GenericTemplatesNode, AssignmentStatementNode,
} from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type DomainChildren = {
    type: ReferenceNode;
    generic_templates: GenericTemplatesNode;
    enum: EnumNode;
    domain: DomainNode;
    uses: UsesNode;
    functor: FunctorNode;
    assignment_statement: AssignmentStatementNode;
    expression: ExpressionNode;
    domain_interface: DomainInterfaceNode;
};

export class DomainBuilder extends BaseBuilder<DomainNode, DomainChildren> {
    protected build(tokens: TokenMatcher, { not, get, ensure, peek }: TypedTokenMatcherInterface) {
        if (not.identifier('domain')) {
            return null;
        }

        const identifier = ensure.identifier();
        const generics = this.child.generic_templates(tokens);
        const parent: ReferenceNode | undefined = get.identifier('of')
            ? this.child.type(tokens)
            : undefined;
        const inherits = !!get.identifier('is');

        ensure.symbol('{');

        const uses = this.child.uses(tokens);
        const interfaced = this.child.domain_interface(tokens);
        const domains = new Map<string, DomainNode>();
        const methods = new Map<string, FunctorNode>();
        const privates = new Map<string, AssignmentStatementNode>();
        const traits = new Set<ExpressionNode>();

        while (true) {
            const domain = this.child.domain(tokens);

            if (domain) {
                if (domains.has(domain.identifier)) {
                    throw this.error(tokens, domain, `Domain with the same name "${domain.identifier}" already present`);
                }

                domains.set(domain.identifier, domain);

                continue;
            }

            const enumeration = this.child.enum(tokens);

            if (enumeration) {
                if (domains.has(enumeration.identifier)) {
                    throw this.error(tokens, enumeration, `Enum with the same name "${enumeration.identifier}" already present`);
                }

                domains.set(enumeration.identifier, enumeration);

                continue;
            }

            if (get.identifier('is')) {
                const trait = this.child.expression(tokens);

                traits.add(trait);

                ensure.symbol(';');

                continue;
            }

            break;
        }

        while (true) {
            if (peek.identifier('let')) {
                const name = peek.identifier(undefined, 1)!;
                const assignment = this.child.assignment_statement(tokens);

                if (name && privates.has(name)) {
                    throw this.error(tokens, assignment, `Private value with the same name "${name}" already present`);
                }

                if (assignment) {
                    privates.set(name, assignment);

                    get.symbol(';');

                    continue;
                } else {
                    throw this.error(tokens, 'declaration', `Declaration expected`);
                }
            }

            let name = get.identifier();

            if (name) {
                const getter = name === 'get';

                if (getter) {
                    name = get.identifier()!;
                }

                const method = this.child.functor(tokens);

                if (method) {
                    if (methods.has(name)) {
                        throw this.error(tokens, method, `${getter ? 'Getter' : 'Method'}} with the same name "${name}" already present`);
                    }

                    methods.set(name, method);

                    continue;
                } else {
                    throw this.error(tokens, getter ? 'getter' : 'method', `Method body expected`);
                }
            }

            break;
        }

        const ctor = peek.symbol('(') ? this.child.functor(tokens) : null;

        ensure.symbol('}');

        return new DomainNode(
            identifier,
            generics,
            parent,
            inherits,
            interfaced,
            uses,
            domains,
            methods,
            privates,
            ctor,
        );
    }
}
