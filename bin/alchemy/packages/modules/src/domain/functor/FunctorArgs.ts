import { Translated } from '@intent/translator';
import { FunctorArgsNode } from '@alchemy/ast';
import { FunctorArg } from './FunctorArg';

export class FunctorArgs extends Translated<FunctorArgsNode> {
    public args: FunctorArg[] = [];

    toString() {
        return `${this.args.join(', ')}`;
    }
}
