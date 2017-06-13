
import { AbstractTranspiler } from '../../flow/transpiler/AbstractTranspiler';
import { Container } from "../../flow/transpiler/Container";
import { PropertyNode } from '../ast/PropertyNode';
import { PropertyTranspiler } from './PropertyTranspiler';

export class PropertiesTranspiler extends AbstractTranspiler<Container<PropertyNode>, string[]> {
  private property: PropertyTranspiler = new PropertyTranspiler();

  public process(properties: Container<PropertyNode>) {
    return Object.keys(properties)
      .map((name) => properties[name])
      .map((property: PropertyNode) => this.property.process(property))
    ;
  }
}
