import { CallNode, CallArgNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type CallTranslatorChildren = {
  call_arg: CallArgNode;
};

export class CallTranslator extends NodeTranslator<CallNode, CallTranslatorChildren> {
  translate(node: CallNode, context): string {
    return `(${this.wrapInlineList(node.right.args.map((arg) => this.child.call_arg(arg, context)))})`;
  }
}
