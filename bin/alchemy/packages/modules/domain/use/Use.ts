import { UseNode } from '@alchemy/ast';
import { Translated } from '../../Translated';
import { Decomposition } from './Decomposition';

export class Use extends Translated<UseNode> {
    public decomposition: Decomposition;

    toString() {
        return `use ${this.decomposition}`;
    }
}
