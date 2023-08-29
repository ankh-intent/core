import { Translated } from '@intent/translator';
import { PrimitiveNode, PrimitiveType } from '@alchemy/ast';

export class PrimitiveLiteral extends Translated<PrimitiveNode> {
    public value: string;
    public type: PrimitiveType;

    toString() {
        return this.type === PrimitiveType.String ? `\`${this.value}\`` : `${this.value}`;
    }
}
