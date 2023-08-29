import { Operation } from '../Operation';

export class Postfix extends Operation<never> {
    public readonly binary = false;
    declare public readonly right: never;
}
