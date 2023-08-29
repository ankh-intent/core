import { Translated } from '@intent/translator';
import { DereferenceNode } from '@alchemy/ast';
import { ObjectSpread } from './ObjectSpread';

export class Dereference extends Translated<DereferenceNode> {
    public identifier: string;
    public spread?: ObjectSpread;

    isSpread(): this is Dereference & { spread: ObjectSpread } {
        return !!this.spread;
    }

    toString() {
        return this.isSpread() ? String(this.spread) : this.identifier;
    }
}
