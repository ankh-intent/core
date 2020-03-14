import { BreakStatement } from '../../../../../modules';
import { BreakStatementNode } from '../../../../ast';
import { NodeTranslator } from '../../../NodeTranslator';

export type BreakStatementTranslatorChildren = {
};

export class BreakStatementTranslator extends NodeTranslator<BreakStatement, BreakStatementTranslatorChildren> {
  translate(node: BreakStatementNode, c): BreakStatement {
    return BreakStatement.create(node, c.parent, {
      type: node.type,
    });
  }
}
