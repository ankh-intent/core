

import { Transpiler } from '../../flow/transpiler/Transpiler';
import { Container } from '../../flow/transpiler/Container';
import { TypeDefNode } from '../ast/TypeDefNode';
import { TypeDefTranspiler } from './TypeDefTranspiler';

export class TypeDefsTranspiler extends Transpiler<Container<TypeDefNode>, string[]> {
  private typedef: TypeDefTranspiler = new TypeDefTranspiler();

  public process(typedefs: Container<TypeDefNode>) {
    return Object.keys(typedefs)
      .map((name) => typedefs[name])
      .map((typedef: TypeDefNode) => this.typedef.process(typedef))
    ;
  }
}
