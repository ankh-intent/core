import { Translated } from '@intent/translator';
import { IdentifierNode } from '@alchemy/ast';

export class Identifier extends Translated<IdentifierNode> {
    public name: string;

    toString() {
        return `${this.name}`;
    }
}
