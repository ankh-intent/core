
export interface Visitor<C, O> {
  visit(context: C): O;
}
