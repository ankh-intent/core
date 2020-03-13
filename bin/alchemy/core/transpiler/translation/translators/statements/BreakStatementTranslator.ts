import { BlockNode, BreakStatementNode, BreakType } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type BreakStatementTranslatorChildren = {
  block: BlockNode;
};

const KEYWORDS = {
  [BreakType.Break]: 'break',
  [BreakType.Continue]: 'continue',
};

export class BreakStatementTranslator extends NodeTranslator<BreakStatementNode, BreakStatementTranslatorChildren> {
  translate(node: BreakStatementNode): string {
    return KEYWORDS[node.type];
  }
}
