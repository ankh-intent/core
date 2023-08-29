import { Translated } from '@intent/translator';
import { TraitNode } from '../../ast';
import { Expression } from './functor';

export class Trait extends Translated<TraitNode> {
    public identifier: string;
    public expression: Expression;

    toString() {
        return `trait ${this.identifier} is ${this.expression}`;
    }
}
