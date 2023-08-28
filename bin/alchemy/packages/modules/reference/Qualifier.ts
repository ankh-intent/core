import { Translated } from '@intent/translator';
import { QualifierNode } from '@alchemy/ast';

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
