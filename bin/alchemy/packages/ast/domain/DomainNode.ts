import { AbstractNode, TreeNode } from '@intent/kernel';

import { FunctorNode } from '../functor';
import { DomainInterfaceNode } from './interface';
import { ReferenceNode, GenericTemplatesNode } from '../reference';
import { UsesNode } from '../use';
import { AssignmentStatementNode } from '../block';

export class DomainNode extends AbstractNode {
    constructor(
        public identifier: string,
        public generics: GenericTemplatesNode,
        public parent: ReferenceNode | undefined,
        public inherits: boolean,
        public interfaced: DomainInterfaceNode,
        public uses: UsesNode,
        public domains: Map<string, DomainNode> = new Map(),
        public methods: Map<string, FunctorNode> = new Map(),
        // todo: transpile
        public privates: Map<string, AssignmentStatementNode> = new Map(),
        public ctor: FunctorNode | null = null,
    ) {
        super();
    }

    get children(): TreeNode[] {
        return [
            this.generics,
            this.parent!,
            this.interfaced,
            this.uses,
            this.ctor!,
            ...this.domains.values(),
            ...this.methods.values(),
            ...this.privates.values(),
        ].filter(Boolean);
    }

    inspect(): any {
        const { domains, methods, privates, uses, parent, ctor, generics, interfaced, ...rest } = this;

        return {
            ...(uses.map.size && { uses }),
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
