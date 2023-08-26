import { ExpressionNode } from '@alchemy/ast';

import { Translated } from '../../../../Translated';
import { Operation } from './Operation';

export class Expression<
    N extends ExpressionNode = ExpressionNode,
    T extends Translated<N> = Translated<N>,
> extends Translated<N> {
    public base: T;
    public operations: Operation[] = [];

    toString() {
        return this.operations.reduce(
            (acc, operation) => {
                const sum = `${acc}${operation}`;

                return operation.binary ? `(${sum})` : sum;
            },
            String(this.base),
        );
    }
}
