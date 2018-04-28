
import { AbstractTranspiler, TranspilerInterface } from '../../transpiler/AbstractTranspiler';
import { PropertyNode } from '../../intent/ast/PropertyNode';
import { TypeTranspiler } from './TypeTranspiler';
import { Container } from '../../../../../intent-utils/Container';

export class PropertyTranspiler extends AbstractTranspiler<PropertyNode> {
  protected visitors: Container<TranspilerInterface<any>> = {
    type: new TypeTranspiler(this.compiler),
  };

  public get code(): string {
    return `{%name%}: {%type%}`;
  }
}
