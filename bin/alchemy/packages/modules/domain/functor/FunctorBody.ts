import { Translated } from '@intent/translator';
import { FunctorBodyNode } from '@alchemy/ast';
import { Block } from './statements';

export class FunctorBody extends Translated<FunctorBodyNode> {
    public body: Block;

    toString() {
        return this.body.toString();
    }
}
