import { TreeNode } from '../../../ast';
import { Visitor } from './Visitor';

export type NodeIdentifiersMap = {
  [name: string]: TreeNode;
}

export interface NodeInvoker<N, C, O> {
  (node: N, context: C): O;
}

export type NodeInvokers<T = any, C = any, O = any> = {
  [name in keyof T]: NodeInvoker<T[name], C, O>;
}

export abstract class Walker<
  N,
  C,
  O,
  I extends NodeIdentifiersMap
> implements Visitor<N, C, O> {
  protected child: NodeInvokers<I>;

  constructor(children: NodeInvokers<I>) {
    this.child = children;
  }

  abstract visit(node: N, context: C): O;
}

