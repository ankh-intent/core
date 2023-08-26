import { BreakStatement } from '../../../../../modules';
import { BreakStatementNode } from '../../../../ast';
import { NodeTranslator } from '../../../NodeTranslator';
import { TranslationContext } from '../../../TranslationContext';

export type BreakStatementTranslatorChildren = {};

export class BreakStatementTranslator extends NodeTranslator<BreakStatement, BreakStatementTranslatorChildren> {
    translate(node: BreakStatementNode, context: TranslationContext<any>): BreakStatement {
        return BreakStatement.create(node, context.parent, {
            type: node.type,
        });
    }
}
