import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import {
    DomainNode,
    UsesNode,
    FunctorNode,
    ReferenceNode,
    EnumNode,
    ExpressionNode,
    DomainInterfaceNode,
    GenericTemplatesNode,
    AssignmentStatementNode,
    TraitNode,
    ConstraintNode,
    DomainModifierNode,
    CastNode,
} from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type DomainChildren = {
    domain_modifier: DomainModifierNode;
    type: ReferenceNode;
    generic_templates: GenericTemplatesNode;
    enum: EnumNode;
    domain: DomainNode;
    uses: UsesNode;
    functor: FunctorNode;
    assignment_statement: AssignmentStatementNode;
    expression: ExpressionNode;
    domain_interface: DomainInterfaceNode;
    trait: TraitNode;
    constraint: ConstraintNode;
    cast: CastNode;
};

export class DomainBuilder extends BaseBuilder<DomainNode, DomainChildren> {
    protected build(tokens: TokenMatcher, { not, get, ensure, peek }: TypedTokenMatcherInterface) {
        const modifier = this.child.domain_modifier(tokens);

        if (not.identifier('domain')) {
            return null;
        }

        if (modifier.isNative) {
            tokens.mark('IS_NATIVE');
            tokens.mark('IS_ABSTRACT');
        }

        const domains = new Map<string, DomainNode>();
        const methods = new Map<string, FunctorNode>();
        const privates = new Map<string, AssignmentStatementNode>();
        const casts = new Map<string, CastNode>();
        const traits = new Map<string, TraitNode>();
        const constraints = new Set<ConstraintNode>();
        const identifier = ensure.identifier();
        const generics = this.child.generic_templates(tokens);
        const parent: ReferenceNode | undefined = get.identifier('of')
            ? this.child.type(tokens)
            : undefined;
        const inherits = !!get.identifier('is');
        const isConstraint = inherits && peek.identifier();
        let interfaced: DomainInterfaceNode;
        let uses: UsesNode;
        let ctor: FunctorNode | null = null;

        if (isConstraint) {
            const constraint = this.child.constraint(tokens);

            constraints.add(constraint);

            interfaced = this.child.domain_interface(tokens);
            uses = this.child.uses(tokens);

            ensure.symbol(';');
        } else {
            ensure.symbol('{');

            interfaced = this.child.domain_interface(tokens);
            uses = this.child.uses(tokens);

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

                if (get.identifier('to')) {
                    const cast = this.child.cast(tokens);
                    const type = cast.type.toString();

                    if (casts.has(type)) {
                        throw this.error(tokens, cast, `Typecast to the same type "${type}" already present`);
                    }

                    casts.set(type, cast);

                    ensure.symbol(';');

                    continue;
                }

                if (get.identifier('trait')) {
                    const trait = this.child.trait(tokens);

                    if (traits.has(trait.identifier)) {
                        throw this.error(tokens, trait, `Trait with the same name "${trait.identifier}" already present`);
                    }

                    traits.set(trait.identifier, trait);

                    ensure.symbol(';');

                    continue;
                }

                if (get.identifier('is')) {
                    const constraint = this.child.constraint(tokens);

                    constraints.add(constraint);

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

            if (peek.symbol('(')) {
                ctor = this.child.functor(tokens);
            }

            ensure.symbol('}');
        }

        return new DomainNode(
            identifier,
            modifier,
            generics,
            parent,
            inherits,
            interfaced,
            uses,
            domains,
            methods,
            casts,
            traits,
            constraints,
            privates,
            ctor,
        );
    }
}
