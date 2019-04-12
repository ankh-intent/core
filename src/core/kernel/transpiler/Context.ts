
export interface ContextInterface<D, T> {
  apply<K extends keyof D>(ref: K): ContextInterface<D[K], any>;
}
