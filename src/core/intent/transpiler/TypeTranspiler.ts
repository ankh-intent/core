
import { TypeNode } from '../ast/TypeNode';
import { Transpiler } from '../../flow/transpiler/Transpiler';

export class TypeTranspiler extends Transpiler<TypeNode, string> {
  public process(type: TypeNode) {
    return type.qualifier.path('.') + (
      type.generic
        ? `<${this.process(type.generic)}>`
        : ``
    );
  }
}
