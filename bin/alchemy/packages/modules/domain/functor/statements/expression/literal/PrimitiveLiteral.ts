import { PrimitiveNode, PrimitiveType } from '@alchemy/ast';
import { Translated } from '../../../../../Translated';

export class PrimitiveLiteral extends Translated<PrimitiveNode> {
    public value: string;
    public type: PrimitiveType;

    toString() {
        return `${this.value}`;
    }
}
