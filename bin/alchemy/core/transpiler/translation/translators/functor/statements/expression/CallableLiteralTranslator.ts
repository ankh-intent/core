import { CallableNode, FunctorNode } from '../../../../../ast';
import { NodeTranslator } from '../../../../NodeTranslator';

export type CallableLiteralTranslatorChildren = {
  functor: FunctorNode;
};

export class CallableLiteralTranslator extends NodeTranslator<CallableNode, CallableLiteralTranslatorChildren> {
  translate(node: CallableNode, context): string {
    return this.child.functor(node.functor, context);
  }
}
