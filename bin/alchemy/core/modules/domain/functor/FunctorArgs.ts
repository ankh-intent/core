import { FunctorArgsNode } from '../../../transpiler';
import { Translated } from '../../Translated';
import { FunctorArg } from './FunctorArg';

export class FunctorArgs extends Translated<FunctorArgsNode> {
    public args: FunctorArg[] = [];

    toString() {
        return `${this.args.join(', ')}`;
    }
}
