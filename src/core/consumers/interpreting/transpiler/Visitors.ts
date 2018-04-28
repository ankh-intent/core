
import { ContextInterface } from './Context';
import { Container } from '../../../../intent-utils/Container';

export interface Visitor<D, R> {
  visit(context: ContextInterface<D, R>): R;
}

export class Visitors<D, R, V extends Visitor<D, R> = Visitor<D, R>> {
  private visitors: Container<V> = {};

  public register(name: string, visitor: V): this {
    this.visitors[name] = visitor;

    return this;
  }

  public has(name: string): boolean {
    return !!this.visitors[name];
  }

  public visit(name: string, context: ContextInterface<D, R>): R {
    let visitor = this.visitors[name];

    console.log('visit', name);

    return visitor.visit(
      context.apply(<any>name)
    );
  }
}
