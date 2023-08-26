import { BaseTokenTypes } from '@intent/parser';
import {
    TreeNode,
    Identifiable,
    DependencyNode,
    DependencyManager,
    CoreEvent,
    CoreEventBus,
    AbstractConsumer,
} from '@intent/kernel';

import { PatchedASTEvent, ParsedEvent } from '../../flow-events';
import { PatchStat } from './PatchStat';

export interface IdentifiableFactory<N extends TreeNode, T extends Identifiable<N>> {
    create(identifier: string): T;
}

export class PatchAfterParse<N extends TreeNode, TT extends BaseTokenTypes, T extends Identifiable<N>> extends AbstractConsumer<ParsedEvent<N, TT>, any> {
    private readonly factory: IdentifiableFactory<N, T>;
    private readonly tree: DependencyManager<N, T>;

    public constructor(bus: CoreEventBus, factory: IdentifiableFactory<N, T>, tree: DependencyManager<N, T>) {
        super(bus);
        this.tree = tree;
        this.factory = factory;
    }

    public supports(event: CoreEvent): boolean {
        return event.type === ParsedEvent.type();
    }

    public process(event: ParsedEvent<N, TT>) {
        const { source, ast } = event.data;
        this.stat(event, new PatchStat(source));

        const node = this.tree.find(source.reference) || (
            this.tree.dependency(
                this.factory.create(source.reference),
            )
        );

        return new PatchedASTEvent({
            dependency: this.patchAST(node, ast),
        });
    }

    protected patchAST(node: DependencyNode<N, T>, ast: N): DependencyNode<N, T> {
        // todo: real patching
        node.identifiable.ast = ast;
        return node;
    }
}
