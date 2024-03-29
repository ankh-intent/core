import { AbstractNode } from '@intent/kernel';

export class QualifierNode extends AbstractNode {
    public name: string;
    public child: QualifierNode | null;

    public constructor(name: string, child: QualifierNode | null = null) {
        super();
        this.name = name;
        this.child = child;
    }

    public get children() {
        return [this.child!].filter(Boolean);
    }

    public deepest(): string {
        return this.child
            ? this.child.deepest()
            : this.name;
    }

    public path(join: string = '.'): string {
        return this.child
            ? this.name + join + this.child.path(join)
            : this.name;
    }

    toString(): string {
        return this.path();
    }

    inspect(): any {
        if (this.child) {
            return this;
        }

        const { child, ...rest } = this;

        return rest;
    }
}
