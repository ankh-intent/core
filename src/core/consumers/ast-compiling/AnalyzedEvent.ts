
import { Source } from '../../kernel/source/Source';
import { TreeNode } from '../../kernel/ast';
import { BaseCoreEvent } from '../../kernel/event/CoreEvent';

export interface AnalyzedEventProps<N extends TreeNode> {
  source: Source;
  ast: N;
}

export class AnalyzedEvent<N extends TreeNode> extends BaseCoreEvent<AnalyzedEventProps<N>> {
}
