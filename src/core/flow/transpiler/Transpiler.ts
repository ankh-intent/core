
import { NestedFormatter } from './NestedFormatter';
import { Formatter } from "./Formatter";

export class Transpiler<N, T> {
  protected nested: Formatter = new NestedFormatter();

  public process(node: N): T {
    throw new Error(`Doesn't know how to transpile "${node.constructor.name}"`);
  }
}
