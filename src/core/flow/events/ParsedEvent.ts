
import { Source } from '../../source/Source';
import { TreeNode } from '../../tree/TreeNode';
import { BaseCoreEvent } from '../CoreEvent';

export interface ParsedEventProps<N extends TreeNode> {
  source: Source;
  ast: N;
}

export class ParsedEvent<N extends TreeNode> extends BaseCoreEvent<ParsedEventProps<N>> {
}
