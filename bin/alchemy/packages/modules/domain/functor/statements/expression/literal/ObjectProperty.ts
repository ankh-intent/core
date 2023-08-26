import { ObjectPropertyNode } from '@alchemy/ast';
import { Translated } from '../../../../../Translated';

import { Expression } from '../Expression';

export class ObjectProperty extends Translated<ObjectPropertyNode> {
    public identifier: string;
    public expression: Expression;

    toString() {
        return `${this.identifier}: ${this.expression}`;
    }
}
