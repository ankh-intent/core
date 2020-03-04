import { Visitor } from './Visitor';

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
  I extends NodeInvokers = NodeInvokers
> implements Visitor<N, C, O> {
  protected child: I;

  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(builders: I) {
    this.child = builders;
  }

  abstract visit(node: N, context: C): O;
}

