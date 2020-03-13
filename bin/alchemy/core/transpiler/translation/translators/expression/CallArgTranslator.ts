import { CallArgNode, ExpressionNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type CallArgTranslatorChildren = {
  expression: ExpressionNode;
};

export class CallArgTranslator extends NodeTranslator<CallArgNode, CallArgTranslatorChildren> {
  translate(node: CallArgNode, context): string {
    return (node.identifier ? `/* ${node.identifier}: */` : '') + this.child.expression(node.expression, context);
  }
}
