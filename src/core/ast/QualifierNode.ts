
import { AbstractNode } from './AbstractNode';

export class QualifierNode extends AbstractNode {
  public name: string;
  public child: QualifierNode;

  public deepest(): string {
    return this.child
      ? this.child.deepest()
      : this.name;
  }
}
