import { Translated } from '@intent/translator';
import { ConstraintNode } from '@alchemy/ast';
import { Expression } from './functor';
import { DomainInterface } from '../interfaces';

export class Constraint extends Translated<ConstraintNode> {
    public reference: DomainInterface;
    public expression: Expression | null = null;

    toString() {
        return `is ${this.reference}${this.expression ? ` as ${this.expression}` : ''}`;
    }
}
