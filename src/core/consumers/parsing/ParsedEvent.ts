
import { Source } from '../reading/source/Source';
import { TreeNode } from '../ast-compiling/tree/TreeNode';
import { BaseCoreEvent } from '../../kernel/CoreEvent';

export interface ParsedEventProps<N extends TreeNode> {
  source: Source;
  ast: N;
}

export class ParsedEvent<N extends TreeNode> extends BaseCoreEvent<ParsedEventProps<N>> {
}
