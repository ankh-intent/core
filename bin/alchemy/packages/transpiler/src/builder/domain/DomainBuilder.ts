import { TypedTokenMatcherInterface, TokenMatcher, TryVariants, AbstractNode } from '@intent/kernel';

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
import { BaseBuilder, Markers } from '../BaseBuilder';

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
    trait: TraitNode<DomainNode>;
    constraint: ConstraintNode;
    cast: CastNode;
};

export class DomainBuilder extends BaseBuilder<DomainNode, DomainChildren> {
    protected build(tokens: TokenMatcher, matchers: TypedTokenMatcherInterface) {
        const { not, get, ensure, peek } = matchers;
        const modifier = this.child.domain_modifier(tokens);

        if (not.identifier('domain')) {
            return null;
        }

        if (modifier.isNative) {
            this.setNative(tokens);
            this.setAbstract(tokens);
        }

        const domains = new Map<string, DomainNode>();
        const methods = new Map<string, FunctorNode>();
        const privates = new Map<string, AssignmentStatementNode>();
        const casts = new Map<string, CastNode>();
        const traits: TraitNode<DomainNode>[] = [];
        const constraints = new Set<ConstraintNode>();
        const identifier = ensure.identifier();
        const generics = this.child.generic_templates(tokens);
        const parent: ReferenceNode | undefined = get.identifier('of')
            ? this.child.type(tokens)
            : undefined;
        const inherits = !!get.identifier('is');
        const isConstraint = inherits && peek.identifier();

        const rolls1 = [
            () => this.readCast(casts, tokens),
            () => this.readTrait(traits, tokens),
            () => this.readConstraint(constraints, tokens),
        ];
        const rolls2 = [
            () => this.readDecl(privates, tokens),
            (_: any, isAbstract: boolean) => this.readGetter(methods, tokens, isAbstract),
            (_: any, isAbstract: boolean) => this.readMethod(methods, tokens, isAbstract),
        ];

        if (isConstraint) {
            constraints.add(this.child.constraint(tokens));
        } else {
            ensure.symbol('{');
        }

        const interfaced = this.child.domain_interface(tokens);
        const uses = this.child.uses(tokens);
        let ctor: FunctorNode | null = null;

        if (isConstraint) {
            ensure.symbol(';');
        } else {
            while (true) {
                if (this.getDomain(domains, tokens)) {
                    continue;
                }

                if (this.getEnumeration(domains, tokens)) {
                    continue;
                }

                if (this.withModifier(modifier.isNative, tokens, rolls1)) {
                    continue;
                }

                break;
            }

            while (this.withModifier(modifier.isNative, tokens, rolls2)) {
                //
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
            constraints,
            domains,
            methods,
            casts,
            traits,
            privates,
            ctor,
        );
    }

    withModifier<R extends AbstractNode>(isNative: boolean, tokens: TokenMatcher, variants: TryVariants<R, boolean>) {
        return tokens.try(variants, () => {
            const isAbstract = !isNative && this.child.domain_modifier(tokens).isAbstract;

            if (isAbstract) {
                tokens.mark(Markers.ABSTRACT);
            }

            return isAbstract;
        });
    };

    getDomain(domains: Map<string, DomainNode>, tokens: TokenMatcher) {
        const domain = this.child.domain(tokens);

        if (!domain) {
            return;
        }

        if (domains.has(domain.identifier)) {
            throw this.error(tokens, domain, `Domain with the same name "${domain.identifier}" already present`);
        }

        domains.set(domain.identifier, domain);

        return domain;
    };

    getEnumeration(domains: Map<string, DomainNode>, tokens: TokenMatcher) {
        const enumeration = this.child.enum(tokens);

        if (!enumeration) {
            return;
        }

        if (domains.has(enumeration.identifier)) {
            throw this.error(tokens, enumeration, `Enum with the same name "${enumeration.identifier}" already present`);
        }

        domains.set(enumeration.identifier, enumeration);

        return enumeration;
    };

    readDecl(decls: Map<string, AssignmentStatementNode>, tokens: TokenMatcher) {
        const { peek, ensure } = tokens.matcher;

        if (!peek.identifier('let')) {
            return;
        }

        const assignment = this.child.assignment_statement(tokens);
        const name = assignment.declaredAs;

        if (name && decls.has(name)) {
            throw this.error(tokens, assignment, `Private value with the same name "${name}" already present`);
        }

        decls.set(name, assignment);
        ensure.symbol(';');

        return assignment;
    }

    readGetter(methods: Map<string, FunctorNode>, tokens: TokenMatcher, isAbstract: boolean) {
        const { get, ensure } = tokens.matcher;

        if (!get.identifier('get')) {
            return;
        }

        const name = tokens.matcher.ensure.identifier();
        const method = this.child.functor(tokens);

        if (methods.has(name)) {
            throw this.error(tokens, method, `Getter with the same name "${name}" already present`);
        }

        if (isAbstract) {
            ensure.symbol(';');
        }

        return method;
    }

    readMethod(methods: Map<string, FunctorNode>, tokens: TokenMatcher, isAbstract: boolean) {
        const { peek, ensure } = tokens.matcher;

        if (!peek.identifier()) {
            return;
        }

        try {
            const name = ensure.identifier();
            const method = this.child.functor(tokens);

            if (methods.has(name)) {
                // noinspection ExceptionCaughtLocallyJS
                throw { rethrow: this.error(tokens, method, `Method with the same name "${name}" already present`) };
            }

            if (isAbstract) {
                ensure.symbol(';');
            }

            return method;
        } catch (e) {
            if (e.rethrow) {
                throw e.rethrow;
            }

            if (tokens.has(Markers.FUNCTOR)) {
                throw e;
            }
        }
    }

    readTrait(traits: TraitNode<DomainNode>[], tokens: TokenMatcher) {
        const { get, ensure } = tokens.matcher;

        if (!get.identifier('trait')) {
            return;
        }

        const trait = this.child.trait(tokens);

        traits.push(trait);
        ensure.symbol(';');

        return trait;
    }

    readCast(casts: Map<string, CastNode>, tokens: TokenMatcher) {
        const { get, ensure } = tokens.matcher;

        if (!get.identifier('to')) {
            return;
        }

        const cast = this.child.cast(tokens);
        const type = cast.type.toString();

        if (casts.has(type)) {
            throw this.error(tokens, cast, `Typecast to the same type "${type}" already present`);
        }

        casts.set(type, cast);
        ensure.symbol(';');

        return cast;
    }

    readConstraint(constraints: Set<ConstraintNode>, tokens: TokenMatcher) {
        const { get, ensure } = tokens.matcher;

        if (!get.identifier('is')) {
            return;
        }

        const constraint = this.child.constraint(tokens);

        constraints.add(constraint);
        ensure.symbol(';');

        return constraint;
    }
}
