import { AbstractTranspiler, TranspilerInterface } from '~kernel/transpiler/AbstractTranspiler';

import { PropertyNode } from '../ast/PropertyNode';
import { TypeTranspiler } from './TypeTranspiler';
import { Container } from '../../../../src/core/utils/Container';

export class PropertyTranspiler extends AbstractTranspiler<PropertyNode> {
  protected visitors: Container<TranspilerInterface<any>> = {
    type: new TypeTranspiler(this.compiler),
  };

  public get code(): string {
    return `{%name%}: {%type%}`;
  }
}
