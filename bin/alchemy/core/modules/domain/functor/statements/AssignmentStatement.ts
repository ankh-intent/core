import { AssignmentStatementNode, ExpressionNode } from '../../../../transpiler';
import { Translated } from '../../../Translated';
import { AssignmentTarget } from './AssignmentTarget';
import { Expression, Identifier } from './expression';
import { Statement } from './Statement';

export class AssignmentStatement<T extends Translated<N> = any, N extends ExpressionNode = any> extends Statement<AssignmentStatementNode<N>> {
    public target: AssignmentTarget<T, N>;
    public operator: string;
    public expression: Expression;

    isDeclaration(): this is AssignmentStatement<Identifier> {
        return this.target.isDeclaration();
    }

    get targetBase(): T {
        return this.target.target.base;
    }

    toString() {
        return `${this.target} ${this.operator} ${this.expression}`;
    }
}
