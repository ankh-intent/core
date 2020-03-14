import { Operation } from '../Operation';
import { CallArgs } from './CallArgs';

export class Call extends Operation<any> {
  public readonly binary = false;
  public readonly operation = '(';
  public right: CallArgs;

  toString(): string {
    return `(${this.right})`;
  }
}
