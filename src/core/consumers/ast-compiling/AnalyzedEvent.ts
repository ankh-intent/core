
import { Source } from '../reading/source/Source';
import { TreeNode } from './tree/TreeNode';
import { BaseCoreEvent } from '../../kernel/CoreEvent';

export interface AnalyzedEventProps<N extends TreeNode> {
  source: Source;
  ast: N;
}

export class AnalyzedEvent<N extends TreeNode> extends BaseCoreEvent<AnalyzedEventProps<N>> {
}
