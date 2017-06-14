
import { AbstractCompoundTemplate } from '../../flow/transpiler/templates/CompoundTemplate';
import { TypeDefNode } from '../ast/TypeDefNode';

export class TypeDefTranspiler extends AbstractCompoundTemplate<TypeDefNode> {
  public get code(): string {
    return `
      class {%name%} extends {%parent%} {
        public {%properties%};
        {%can%}
      }`;
  }
}
