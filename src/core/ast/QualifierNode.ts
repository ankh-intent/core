
import { AbstractNode } from './AbstractNode';

export class QualifierNode extends AbstractNode {
  public name: string;
  public child: QualifierNode;

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
