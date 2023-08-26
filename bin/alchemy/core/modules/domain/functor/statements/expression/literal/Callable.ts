import { CallableNode } from '../../../../../../transpiler';
import { Translated } from '../../../../../Translated';
import { Functor } from '../../../Functor';

export class Callable extends Translated<CallableNode> {
    public functor: Functor;

    toString() {
        return `${this.functor}`;
    }
}
