import { OriginInterface } from '@intent/kernel';
import { Translated } from '@intent/translator';
import { QualifierNode } from '@alchemy/ast';

export class Qualifier extends Translated<QualifierNode> {
    public name: string;
    public child: Qualifier | null;

    static fromNode(node: QualifierNode): Qualifier {
        const parent = new Qualifier();
        let current = parent;
        let scroll: QualifierNode | null = node;

        while (scroll) {
            current.ast = scroll;
            current.name = scroll.name;

            scroll = scroll.child;

            if (scroll) {
                current = current.child = new Qualifier();
            }
        }

        return parent;
    };

    public origin(): OriginInterface | undefined {
        return this.ast?.astRegion.from;
    }

    public path(join: string = '.'): string {
        return this.child
            ? this.name + join + this.child.path(join)
            : this.name;
    }

    toString() {
        return `${this.path()}`;
    }
}
