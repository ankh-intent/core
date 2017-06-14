
import { TypeNode } from '../ast/TypeNode';
import { AbstractCompoundTemplate } from "../../flow/transpiler/templates/CompoundTemplate";

export class ParentTranspiler extends AbstractCompoundTemplate<TypeNode> {
  public get code(): string {
    return ` extends {%.name%}`;
  }
}
