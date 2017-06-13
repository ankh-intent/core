
import { AbstractCompoundTemplate } from "../../flow/transpiler/templates/CompoundTemplate";
import { TypeNode } from '../ast/TypeNode';

export class TypeTranspiler extends AbstractCompoundTemplate<TypeNode> {
  public get code(): string {
    return `{%.qualifier%}<{%.generic%}>`;
  }

  public resolve(data: TypeNode, property: string) {
    return data[property];
  }
}
