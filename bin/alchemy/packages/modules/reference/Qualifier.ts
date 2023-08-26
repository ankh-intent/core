import { QualifierNode } from '@alchemy/ast';
import { Translated } from '../Translated';

export class Qualifier extends Translated<QualifierNode> {
    public name: string;
    public child: Qualifier | null;

    public path(join: string = '.'): string {
        return this.child
            ? this.name + join + this.child.path(join)
            : this.name;
    }

    toString() {
        return `${this.path()}`;
    }
}
