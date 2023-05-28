import { AbstractNode, TreeNode } from '@intent/ast';

import { FunctorNode } from '../functor';
import { DomainInterfaceNode } from './interface';
import { ReferenceNode, GenericTemplatesNode } from '../reference';
import { UsesNode } from '../use';

export class DomainNode extends AbstractNode {
    constructor(
        public identifier: string,
        public generics: GenericTemplatesNode,
        public parent: ReferenceNode | undefined,
        public intf: DomainInterfaceNode,
        public uses: UsesNode,
        public domains: Map<string, DomainNode> = new Map(),
        public methods: Map<string, FunctorNode> = new Map(),
        public ctor: FunctorNode | null = null,
    ) {
        super();
    }

    get children(): TreeNode[] {
        return [
            this.generics,
            this.parent!,
            this.intf,
            this.uses,
            this.ctor!,
            ...this.domains.values(),
            ...this.methods.values(),
        ].filter(Boolean);
    }
}
