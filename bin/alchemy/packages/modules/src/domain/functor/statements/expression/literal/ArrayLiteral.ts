import { Translated } from '@intent/translator';
import { ArrayNode } from '@alchemy/ast';
import { Expression } from '../Expression';

export class ArrayLiteral extends Translated<ArrayNode> {
    public items: Expression[] = [];

    toString() {
        return `[${this.items.join(', ')}]`;
    }
}
