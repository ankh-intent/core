
import { Transpiler } from '../../flow/transpiler/Transpiler';
import { Container } from '../../flow/transpiler/Container';
import { CanNode } from '../ast/CanNode';
import { CanTranspiler } from './CanTranspiler';

export class CansTranspiler extends Transpiler<Container<CanNode>, string[]> {
  private can: CanTranspiler = new CanTranspiler();

  public process(cans: Container<CanNode>) {
    return Object.keys(cans)
      .map((name) => cans[name])
      .map((can: CanNode) => this.can.process(can))
    ;
  }
}
