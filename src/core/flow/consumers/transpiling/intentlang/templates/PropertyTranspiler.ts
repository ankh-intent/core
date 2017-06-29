
import { AbstractTranspiler } from './AbstractTranspiler';
import { PropertyNode } from '../../../../../intent/ast/PropertyNode';
import { TypeTranspiler } from './TypeTranspiler';

export class PropertyTranspiler extends AbstractTranspiler<PropertyNode> {
  private type = new TypeTranspiler(this.compiler);

  public get code(): string {
    return `{%name%}: {%type%}`;
  }

  public resolve(data: PropertyNode, key: string): any {
    switch (key) {
      case 'type':
        return this.type.transpile(data.type);
    }

    return super.resolve(data, key);
  }
}
