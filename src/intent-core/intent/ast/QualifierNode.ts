
import { AbstractNode } from '../../tree/AbstractNode';

export class QualifierNode extends AbstractNode {
  public name: string;
  public child: QualifierNode;

  public constructor(name?: string, child?: QualifierNode) {
    super();
    this.name = name;
    this.child = child;
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
}
