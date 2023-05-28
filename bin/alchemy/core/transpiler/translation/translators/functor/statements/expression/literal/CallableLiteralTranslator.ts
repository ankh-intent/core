import { Callable } from '../../../../../../../modules';
import { CallableNode, FunctorNode } from '../../../../../../ast';
import { NodeTranslator } from '../../../../../NodeTranslator';

export type CallableLiteralTranslatorChildren = {
    functor: FunctorNode;
};

export class CallableLiteralTranslator extends NodeTranslator<Callable, CallableLiteralTranslatorChildren> {
    translate(node: CallableNode, c): Callable {
        return Callable.create(node, c.parent, {
            functor: this.child.functor(node.functor, c),
        });
    }
}
