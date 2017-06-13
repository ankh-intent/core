
import { AbstractTranspiler } from '../../flow/transpiler/AbstractTranspiler';
import { TypeTranspiler } from "./TypeTranspiler";
import { PropertyNode } from "../ast/PropertyNode";

export class PropertyTranspiler extends AbstractTranspiler<PropertyNode, string> {
  private type: TypeTranspiler = new TypeTranspiler();

  public process(property: PropertyNode) {
    return `${property.name}/*: ${this.type.process(property.type)}*/`;
  }
}
