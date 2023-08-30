import { Translated } from '@intent/translator';
import { CastNode } from '@alchemy/ast';
import { ReferenceInterface } from '../interfaces';
import { Functor } from './functor';

export class Cast extends Translated<CastNode> {
    public type: ReferenceInterface;
    public functor: Functor | null;

    toString() {
        return `to ${this.type}${this.functor ? ` is ${this.functor}` : ''}`;
    }
}
