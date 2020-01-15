import { Source } from '@intent/source';

import { TreeNode } from '../../kernel/ast';
import { BaseCoreEvent } from '../../kernel/event';

export interface AnalyzedEventProps<N extends TreeNode> {
  source: Source;
  ast: N;
}

export class AnalyzedEvent<N extends TreeNode> extends BaseCoreEvent<AnalyzedEventProps<N>> {
}
