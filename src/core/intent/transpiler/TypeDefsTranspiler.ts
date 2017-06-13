

import { AbstractTranspiler } from '../../flow/transpiler/AbstractTranspiler';
import { Container } from '../../flow/transpiler/Container';
import { TypeDefNode } from '../ast/TypeDefNode';
import { TypeDefTranspiler } from './TypeDefTranspiler';

export class TypeDefsTranspiler extends AbstractTranspiler<Container<TypeDefNode>, string[]> {
  private typedef: TypeDefTranspiler = new TypeDefTranspiler();

  public process(typedefs: Container<TypeDefNode>) {
    return Object.keys(typedefs)
      .map((name) => typedefs[name])
      .map((typedef: TypeDefNode) => this.typedef.process(typedef))
    ;
  }
}
