import { TreeNode } from '@intent/ast';
import { SyntaxError } from '@intent/parser';

export class TranslationError extends SyntaxError {
  public readonly node: TreeNode;
  public readonly parent?: Error;

  public constructor(message: string, node: TreeNode, parent?: Error) {
    super(
      message,
      node.node,
      node.astRegion.source,
      node.astRegion.source.position(node.astRegion.from),
      parent,
    );
  }
}
