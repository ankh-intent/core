export interface Visitor<N, C, O> {
  visit(node: N, context: C): O;
}
