
import { TypeNode } from '../ast/TypeNode';
import { AbstractTranspiler } from '../../flow/transpiler/AbstractTranspiler';

export class TypeTranspiler extends AbstractTranspiler<TypeNode, string> {
  public process(type: TypeNode) {
    return type.qualifier.path('.') + (
      type.generic
        ? `<${this.process(type.generic)}>`
        : ``
    );
  }
}
