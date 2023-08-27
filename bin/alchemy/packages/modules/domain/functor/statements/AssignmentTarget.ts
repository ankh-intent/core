import { Translated } from '@intent/translator';
import { AssignmentTargetNode, ExpressionNode } from '@alchemy/ast';
import { Expression, Identifier } from './expression';

export class AssignmentTarget<T extends Translated<N> = any, N extends ExpressionNode = any> extends Translated<AssignmentTargetNode<N>> {
    public target: Expression<N, T>;
    public _isDeclaration: boolean = true;

    isDeclaration(): this is AssignmentTarget<Identifier> {
        return this._isDeclaration;
    }

    toString() {
        return `${this._isDeclaration ? 'let ' : ''}${this.target}`;
    }
}
