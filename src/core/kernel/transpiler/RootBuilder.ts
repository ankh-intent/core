import { TokenVisitor } from '../ast/TokenVisitor';
import { TreeNode } from '../ast/TreeNode';
import { Tokens } from '../parser/Tokens';
import { BuilderInvokers, BuildInvoker } from './BaseBuilder';

export type InvokableVisitors<T> = {[name in keyof T]: TokenVisitor<any>};
export type RootInvokers<G, N extends TreeNode> = G & { root: BuildInvoker<N> };

export class RootBuilder<
  Grammar,
  Node extends TreeNode,
  Invokers extends RootInvokers<Grammar, Node> = RootInvokers<Grammar, Node>,
> implements TokenVisitor<Node> {
  protected readonly invokers: BuilderInvokers<Invokers>;

  public constructor() {
    this.invokers = <any>{};

    for (const builder of Object.keys(this.builders)) {
      const visitor = this.builders[builder];

      this.invokers[builder] = visitor.visit.bind(visitor);
    }
  }

  protected get builders(): InvokableVisitors<Invokers> {
    return <any>{
    };
  }

  public visit(tokens: Tokens): Node {
    return this.invokers.root(tokens);
  }
}
