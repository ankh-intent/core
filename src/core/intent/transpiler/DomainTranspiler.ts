
import { Transpiler } from '../../flow/transpiler/Transpiler';
import { DomainNode } from '../ast/DomainNode';
import { TypeDefsTranspiler } from './TypeDefsTranspiler';

export class DomainTranspiler extends Transpiler<DomainNode, string> {
  private typedefs: TypeDefsTranspiler = new TypeDefsTranspiler();

  public process(domain: DomainNode): string {
    return this.typedefs.process(domain.types).join("\n");
  }
}
