
import { Transpiler } from '../../flow/transpiler/Transpiler';
import { CanNode } from "../ast/CanNode";
import { PropertiesTranspiler } from './PropertiesTranspiler';
import { TypeTranspiler } from "./TypeTranspiler";

export class CanTranspiler extends Transpiler<CanNode, string> {
  private properties: PropertiesTranspiler = new PropertiesTranspiler();
  private type: TypeTranspiler = new TypeTranspiler();

  public process(can: CanNode) {
    return `${can.name}(${this.properties.process(can.args).join(", ")})` +
      (can.returns ? `/*: ${this.type.process(can.returns)}*/` : '') +
      ` {\n` +
      this.nested.format(can.body) +
      `\n}`;
  }
}
