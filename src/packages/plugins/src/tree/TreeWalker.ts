import { Visitor } from './Visitor';
import { NodeInvokers } from './Walker';

export type InvokableVisitors<T> = {[N in keyof T]: Visitor<any, any, any>};
export type RootInvokers<G, N, C, O> = NodeInvokers<Omit<G, 'root'> & { root: N }, C, O>;

export class TreeWalker<
  N,
  C,
  O,
  Grammar,
  Invokers extends RootInvokers<Grammar, N, C, O> = RootInvokers<Grammar, N, C, O>,
> implements Visitor<N, C, O> {
  protected _invokers: Invokers;

  protected get invokers() {
    if (!this._invokers) {
      this._invokers = <Invokers>{};

      for (const builder of Object.keys(this.visitors)) {
        const visitor = this.visitors[builder];

        this._invokers[builder] = visitor.visit.bind(visitor);
      }
    }

    return this._invokers;
  }

  protected get visitors(): InvokableVisitors<Invokers> {
    return <any>{
    };
  }

  public visit(node: N, context: C): O {
    return this.invokers.root(node as any, context);
  }
}
