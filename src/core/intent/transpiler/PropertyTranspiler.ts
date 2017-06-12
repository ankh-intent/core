
import { Transpiler } from '../../flow/transpiler/Transpiler';
import { TypeTranspiler } from "./TypeTranspiler";
import { PropertyNode } from "../ast/PropertyNode";

export class PropertyTranspiler extends Transpiler<PropertyNode, string> {
  private type: TypeTranspiler = new TypeTranspiler();

  public process(property: PropertyNode) {
    return `${property.name}/*: ${this.type.process(property.type)}*/`;
  }
}
