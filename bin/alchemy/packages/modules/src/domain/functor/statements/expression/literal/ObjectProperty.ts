import { Translated } from '@intent/translator';
import { ObjectPropertyNode } from '@alchemy/ast';

import { Expression } from '../Expression';

export class ObjectProperty extends Translated<ObjectPropertyNode> {
    public identifier: string;
    public expression: Expression;

    toString() {
        return `${this.identifier}: ${this.expression}`;
    }
}
