import { Translated } from '@intent/translator';
import { ObjectSpreadItemNode, ObjectSpreadNode } from '@alchemy/ast';

export class ObjectSpreadItem<N extends Translated<any>> extends Translated<ObjectSpreadItemNode<ObjectSpreadNode>> {
    public identifier: string;
    public isRest: boolean;
    public spread?: N;

    isSpread<N extends Translated<any>>(): this is ObjectSpreadItem<N> & { spread: N } {
        return !!this.spread;
    }

    toString() {
        return (this.isRest ? '...' : '') + this.identifier + (this.isSpread() ? `: ${this.spread}` : '');
    }
}
