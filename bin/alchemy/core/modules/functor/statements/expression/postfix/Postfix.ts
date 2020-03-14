import { Operation } from '../Operation';

export class Postfix extends Operation<never> {
  public readonly binary = false;
  public readonly right: never;
}
