import { TreeNode } from '@intent/kernel';

export type TranslatedConstructor<T extends Translated<N, P>, N extends TreeNode = any, P extends TreeNode = any> = {
  new(ast?: N, parentNode?: Translated<P>): T;

  create<
    T extends TranslatedConstructor<Translated<AST, PN>>,
    N extends InstanceType<T>,
    P extends Translated<PN>,
    AST extends TreeNode,
    PN extends TreeNode,
  >(
    this: T,
    ast: AST,
    parentNode: P|undefined,
    factoryOrData?: TranslatedFactory<N>
  ): N;
  create<T extends TranslatedConstructor<Translated<any>>, N extends InstanceType<T>, P extends Translated<any>>(
    this: T,
    parentNode: P,
    factoryOrData?: TranslatedFactory<N>
  ): N;
  create<T extends TranslatedConstructor<Translated<any>>, N extends InstanceType<T>>(
    this: T,
    factoryOrData?: TranslatedFactory<N>
  ): N;
};
export type TranslatedFactory<T> = Partial<T>|((intermediate: T) => Partial<T>);

const isASTNode = <AST extends TreeNode>(node?: any): node is AST => (
  !!(node && node.astRegion)
);
const isTranslated = <P extends Translated<any>, N extends Translated<any>>(nodeOrFactory?: P|TranslatedFactory<N>|Partial<N>): nodeOrFactory is P => (
  nodeOrFactory instanceof Translated
);
const isFactory = <N>(factoryOrData?: TranslatedFactory<N>|Partial<N>): factoryOrData is TranslatedFactory<N> => (
  typeof factoryOrData === 'function'
);

export class Translated<N extends TreeNode, P extends TreeNode = any> {
  constructor(public ast?: N|undefined, public parentNode?: Translated<P>) {
  }

  static create<
    T extends TranslatedConstructor<Translated<AST, PN>>,
    N extends InstanceType<T>,
    P extends Translated<PN>,
    AST extends TreeNode,
    PN extends TreeNode,
  >(
    this: T,
    ast: AST,
    parentNode: P|undefined,
    factoryOrData?: TranslatedFactory<N>|Partial<N>
  ): N;
  static create<T extends TranslatedConstructor<Translated<any>>, N extends InstanceType<T>, P extends Translated<any>>(
    this: T,
    parentNode: P,
    factoryOrData?: TranslatedFactory<N>|Partial<N>
  ): N;
  static create<T extends TranslatedConstructor<Translated<any>>, N extends InstanceType<T>>(
    this: T,
    factoryOrData?: TranslatedFactory<N>|Partial<N>
  ): N;

  static create<
    T extends TranslatedConstructor<Translated<AST, PN>>,
    N extends InstanceType<T>,
    P extends Translated<PN>,
    AST extends TreeNode,
    PN extends TreeNode,
  >(this: T, ...args: any[]): N {
    let ast: AST|undefined;
    let parent: P|undefined;
    let factory: TranslatedFactory<N>|Partial<N>|undefined;
    let partial: Partial<N>|undefined;

    for (const arg of arguments) {
      if (isASTNode<AST>(arg)) {
        ast = arg;
      } else if (isTranslated<P, N>(arg)) {
        parent = arg;
      } else if (isFactory<N>(arg)) {
        factory = arg;
      } else {
        partial = arg;
      }
    }

    const node = new this(ast, parent) as N;
    const data = typeof factory === 'function' ? factory(node) : partial;

    return (
      data
        ? Object.assign(node, data)
        : node
    );
  }
}
