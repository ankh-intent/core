import { FunctorArgNode } from '@alchemy/ast';
import { ReferenceInterface } from '../../interfaces';
import { Translated } from '../../Translated';

export class FunctorArg extends Translated<FunctorArgNode> {
    public name: string;
    public type: ReferenceInterface;

    toString() {
        return `${this.name}: ${this.type}`;
    }
}
