import { CallArgsNode } from '../../../../../../transpiler/ast';
import { Translated } from '../../../../../Translated';

import { CallArg } from './CallArg';

export class CallArgs extends Translated<CallArgsNode> {
    public args: CallArg[];

    toString(): string {
        return `${this.args.join(', ')}`;
    }
}
