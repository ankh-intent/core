import { BaseTokenTypes } from '../parser/Tokenizer';
import { TokenMatcher } from '../parser/TokenMatcher';
import { TokenVisitor } from '../ast/TokenVisitor';
import { TreeNode } from '../ast/TreeNode';
import { BuilderInvokers, BuildInvoker } from './BaseBuilder';

export type InvokableVisitors<T> = {[name in keyof T]: TokenVisitor<any>};
export type RootInvokers<TT extends BaseTokenTypes, G, N extends TreeNode> = G & { root: BuildInvoker<N, TT> };

export class RootBuilder<
  TT extends BaseTokenTypes,
  Grammar,
  Node extends TreeNode,
  Invokers extends RootInvokers<TT, Grammar, Node> = RootInvokers<TT, Grammar, Node>,
> implements TokenVisitor<Node, TT> {
  protected readonly invokers: BuilderInvokers<Invokers, TT>;

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

  public visit(tokens: TokenMatcher<TT>): Node {
    return this.invokers.root(tokens);
  }
}
