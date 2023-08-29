import { Translated } from '@intent/translator';
import { CastNode } from '@alchemy/ast';
import { Expression } from './functor';
import { ReferenceInterface } from '../interfaces';

export class Cast extends Translated<CastNode> {
    public type: ReferenceInterface;
    public expression?: Expression;

    toString() {
        return `to ${this.type} ${this.expression ? `is ${this.expression}` : ''}`;
    }
}
