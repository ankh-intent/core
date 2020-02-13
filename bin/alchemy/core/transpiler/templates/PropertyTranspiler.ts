import { Container } from '@intent/utils';
import { AbstractTranspiler, TranspilerInterface } from '@intent/kernel/transpiler';

import { ObjectPropertyNode } from '../ast';
import { TypeTranspiler } from './TypeTranspiler';

export class PropertyTranspiler extends AbstractTranspiler<ObjectPropertyNode> {
  protected visitors: Container<TranspilerInterface<any>> = {
    type: new TypeTranspiler(this.compiler),
  };

  public get code(): string {
    return `{%name%}: {%type%}`;
  }
}
