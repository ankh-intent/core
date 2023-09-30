import { Translated } from '@intent/translator';
import { CallArgNode } from '@alchemy/ast';
import { Expression } from '../Expression';

export class CallArg extends Translated<CallArgNode> {
    public identifier: string | null;
    public expression: Expression;

    toString(): string {
        return `${this.identifier ? `${this.identifier}: ` : ''}${this.expression}`;
    }
}
