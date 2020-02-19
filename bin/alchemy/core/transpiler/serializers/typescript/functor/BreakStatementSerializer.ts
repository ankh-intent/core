import { BlockNode, BreakStatementNode, BreakType } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface BreakStatementSerializerChildren {
  block: BlockNode;
}

const KEYWORDS = {
  [BreakType.Break]: 'break',
  [BreakType.Continue]: 'continue',
};

export class BreakStatementSerializer extends NodeSerializer<BreakStatementNode, BreakStatementSerializerChildren> {
  serialize(node: BreakStatementNode): string {
    return KEYWORDS[node.type];
  }
}
