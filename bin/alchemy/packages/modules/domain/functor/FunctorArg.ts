import { Translated } from '@intent/translator';
import { FunctorArgNode } from '@alchemy/ast';
import { ReferenceInterface } from '../../interfaces';

export class FunctorArg extends Translated<FunctorArgNode> {
    public name: string;
    public type: ReferenceInterface;

    toString() {
        return `${this.name}: ${this.type}`;
    }
}
