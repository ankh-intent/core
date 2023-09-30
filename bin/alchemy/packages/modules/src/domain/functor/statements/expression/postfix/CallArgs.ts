import { Translated } from '@intent/translator';
import { CallArgsNode } from '@alchemy/ast';

import { CallArg } from './CallArg';

export class CallArgs extends Translated<CallArgsNode> {
    public args: CallArg[];

    toString(): string {
        return `${this.args.join(', ')}`;
    }
}
