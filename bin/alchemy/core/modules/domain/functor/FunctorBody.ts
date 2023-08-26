import { FunctorBodyNode } from '../../../transpiler';
import { Translated } from '../../Translated';
import { Block } from './statements';

export class FunctorBody extends Translated<FunctorBodyNode> {
    public body: Block;

    toString() {
        return this.body.toString();
    }
}
