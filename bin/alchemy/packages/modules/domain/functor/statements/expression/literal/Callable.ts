import { Translated } from '@intent/translator';
import { CallableNode } from '@alchemy/ast';
import { Functor } from '../../../Functor';

export class Callable extends Translated<CallableNode> {
    public functor: Functor;

    toString() {
        return `${this.functor}`;
    }
}
