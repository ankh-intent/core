import { Visitor } from './Visitor';
import { NodeInvokers } from './Walker';

export type InvokableVisitors<T> = { [N in keyof T]: Visitor<any, any, any> };
export type RootInvokers<G, N, C, O> = NodeInvokers<Omit<G, 'root'> & { root: N }, C, O>;

export abstract class TreeWalker<
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
            const visitors = Object.entries(this.visitors) as [keyof Invokers, Visitor<any, any, any>][];

            for (const [builder, visitor] of visitors) {
                this._invokers[builder] = visitor.visit.bind(visitor);
            }
        }

        return this._invokers;
    }

    protected abstract get visitors(): InvokableVisitors<Invokers>;

    public visit(node: N, context: C): O {
        return this.invokers.root(node as any, context);
    }
}
