import { AssignmentStatement } from './AssignmentStatement';

export class LoopIterator extends AssignmentStatement {
  public readonly operator = 'of';

  toString() {
    return `${this.target} of ${this.expression}`;
  }
}
