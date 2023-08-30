import { SyntaxError, TreeNode } from '@intent/kernel';

export class TranslationError extends SyntaxError {
    public readonly node: TreeNode;
    declare public readonly parent?: Error;

    public constructor(message: string, node: TreeNode, parent?: Error) {
        super(
            message,
            node.node,
            node.astRegion.source,
            node.astRegion.position,
            parent,
        );
    }
}
