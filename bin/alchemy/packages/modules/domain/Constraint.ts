import { Translated } from '@intent/translator';
import { ConstraintNode } from '../../ast';
import { Expression } from './functor';

export class Constraint extends Translated<ConstraintNode> {
    public expression: Expression;

    toString() {
        return `is ${this.expression}`;
    }
}
