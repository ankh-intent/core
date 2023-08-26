import { StatementNode } from '../../../../transpiler';
import { Translated } from '../../../Translated';

export class Statement<N extends StatementNode = StatementNode> extends Translated<N> {
    get isAssertion() {
        return true;
    }

    toString() {
        return `statement`;
    }
}
