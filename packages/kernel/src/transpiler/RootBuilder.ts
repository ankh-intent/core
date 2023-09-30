import { BaseTokenTypes, TokenMatcher } from '@intent/parser';
import { Container } from '@intent/utils';

import { TokenVisitor, TreeNode } from '@intent/ast';
import { BuilderInvokers } from './BaseBuilder';

export type InvokableVisitors<T> = { [name in keyof T]: TokenVisitor<any> };
export type RootInvokers<G extends Container<TreeNode>, N extends TreeNode> = G & {
    root: N
};

export class RootBuilder<
    TT extends BaseTokenTypes,
    Grammar extends Container<TreeNode>,
    Node extends TreeNode,
    Invokers extends RootInvokers<Grammar, Node> = RootInvokers<Grammar, Node>,
> implements TokenVisitor<Node, TT> {
    protected readonly invokers: BuilderInvokers<Invokers, TT>;

    public constructor() {
        this.invokers = <any>{};

        for (const [builder, visitor] of Object.entries(this.builders)) {
            this.invokers[builder as keyof Invokers] = visitor.visit.bind(visitor);
        }
    }

    protected get builders(): InvokableVisitors<Invokers> {
        return <any>{};
    }

    public visit(tokens: TokenMatcher<TT>): Node {
        return this.invokers.root(tokens);
    }
}
