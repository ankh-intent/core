import { Visitor } from './Visitor';
import { NodeInvokers } from './Walker';

export type InvokableVisitors<T> = {[N in keyof T]: Visitor<any, any>};
export type RootInvokers<G, N, O> = NodeInvokers<Omit<G, 'root'> & { root: N }, O>;

export class TreeWalker<
  C,
  O,
  Grammar,
  Invokers extends RootInvokers<Grammar, C, O> = RootInvokers<Grammar, C, O>,
> implements Visitor<C, O> {
  protected readonly invokers: Invokers;

  public constructor() {
    this.invokers = <any>{};

    for (const builder of Object.keys(this.visitors)) {
      const visitor = this.visitors[builder];

      this.invokers[builder] = visitor.visit.bind(visitor);
    }
  }

  protected get visitors(): InvokableVisitors<Invokers> {
    return <any>{
    };
  }

  public visit(context: C): O {
    return this.invokers.root(context as any);
  }
}
