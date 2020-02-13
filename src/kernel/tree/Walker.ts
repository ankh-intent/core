import { Visitor } from './Visitor';

export interface NodeInvoker<C, O> {
  (context: C): O;
}

export type NodeInvokers<T = any, O = any> = {
  [name in keyof T]: NodeInvoker<T[name], O>;
}

export abstract class Walker<
  C,
  O,
  I extends NodeInvokers = NodeInvokers
> implements Visitor<C, O> {
  protected child: I;

  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(builders: I) {
    this.child = builders;
  }

  abstract visit(context: C): O;
}

