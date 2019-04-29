import { Container } from '@intent/utils/Container';
import { AbstractTranspiler, TranspilerInterface } from '@intent/kernel/transpiler/AbstractTranspiler';

import { PropertyNode } from '../ast/PropertyNode';
import { TypeTranspiler } from './TypeTranspiler';

export class PropertyTranspiler extends AbstractTranspiler<PropertyNode> {
  protected visitors: Container<TranspilerInterface<any>> = {
    type: new TypeTranspiler(this.compiler),
  };

  public get code(): string {
    return `{%name%}: {%type%}`;
  }
}
