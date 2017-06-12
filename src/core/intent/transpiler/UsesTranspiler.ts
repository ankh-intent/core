
import { Transpiler } from '../../flow/transpiler/Transpiler';
import { UseTranspiler } from './UseTranspiler';
import { Container } from '../../flow/transpiler/Container';
import { UseNode } from "../ast/UseNode";

export class UsesTranspiler extends Transpiler<Container<UseNode>, string[]> {
  private use: UseTranspiler = new UseTranspiler();

  public process(uses: Container<UseNode>) {
    return Object.keys(uses)
      .map((name) => uses[name])
      .map((use: UseNode) => `let ${use.alias} = {}; // ${this.use.process(use)}`)
    ;
  }
}
