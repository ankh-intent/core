
import { AbstractCompoundTemplate } from "../../flow/transpiler/templates/CompoundTemplate";
import { PropertyNode } from '../ast/PropertyNode';

export class PropertyTranspiler extends AbstractCompoundTemplate<PropertyNode> {
  public get code(): string {
    return `{%.name%}/*: {%type%}*/`;
  }
}
