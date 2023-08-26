import { ArrayNode } from '@alchemy/ast';
import { Translated } from '../../../../../Translated';
import { Expression } from '../Expression';

export class ArrayLiteral extends Translated<ArrayNode> {
    public items: Expression[] = [];

    toString() {
        return `[${this.items.join(', ')}]`;
    }
}
