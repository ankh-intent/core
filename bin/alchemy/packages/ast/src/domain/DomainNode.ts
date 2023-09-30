import { AbstractNode, TreeNode } from '@intent/kernel';

import { FunctorNode } from '../functor';
import { ReferenceNode, GenericTemplatesNode } from '../reference';
import { DomainInterfaceNode } from './interface';
import { UsesNode } from '../use';
import { AssignmentStatementNode } from '../block';
import { TraitNode } from './TraitNode';
import { ConstraintNode } from './ConstraintNode';
import { DomainModifierNode } from './DomainModifierNode';
import { CastNode } from './CastNode';

export class DomainNode extends AbstractNode {
    constructor(
        public identifier: string,
        public modifier: DomainModifierNode,
        public generics: GenericTemplatesNode,
        public parent: ReferenceNode | undefined,
        public inherits: boolean,
        public interfaced: DomainInterfaceNode,
        public uses: UsesNode,
        public constraints: Set<ConstraintNode> = new Set(),
        public domains: Map<string, DomainNode> = new Map(),
        public methods: Map<string, FunctorNode> = new Map(),
        public casts: Map<string, CastNode> = new Map(),
        public traits: TraitNode<DomainNode>[] = [],
        public privates: Map<string, AssignmentStatementNode> = new Map(),
        public ctor: FunctorNode | null = null,
    ) {
        super();
    }

    get children(): TreeNode[] {
        return [
            this.modifier,
            this.generics,
            this.parent!,
            this.interfaced,
            this.uses,
            this.ctor!,
            ...this.casts.values(),
            ...this.traits,
            ...this.constraints.values(),
            ...this.domains.values(),
            ...this.privates.values(),
            ...this.methods.values(),
        ].filter(Boolean);
    }

    inspect(): any {
        const { modifier, domains, methods, casts, traits, constraints, privates, uses, parent, ctor, generics, interfaced, ...rest } = this;

        return {
            ...(modifier.isSpecial && { modifier }),
            ...(uses.map.size && { uses }),
            ...(casts.size && { casts }),
            ...(traits.length && { traits }),
            ...(constraints.size && { constraints }),
            ...(domains.size && { domains }),
            ...(privates.size && { privates }),
            ...(methods.size && { methods }),
            ...(parent && { parent }),
            ...(generics.templates.length && { generics }),
            ...(interfaced.properties.size && { interfaced }),
            ...rest,
            ...(ctor && { ctor }),
        };
    }
}
