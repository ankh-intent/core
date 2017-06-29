
import { AbstractTranspiler } from './AbstractTranspiler';
import { CanNode } from '../../../../../intent/ast/CanNode';
import { TypeTranspiler } from './TypeTranspiler';
import { PropertyTranspiler } from './PropertyTranspiler';

export class CanTranspiler extends AbstractTranspiler<CanNode> {
  private type = new TypeTranspiler(this.compiler);
  private property = new PropertyTranspiler(this.compiler);

  protected get code(): string {
    return `
      public {%name%}({%args%}){%returns%} {
        {%body%} 
      }`;
  }

  public resolve(data: CanNode, key: string): any {
    switch (key) {
      case 'args':
        return this.property.keyed(data.args).join(", ");

      case 'returns':
        return data.returns ? ': ' + this.type.transpile(data.returns) : '';

      case 'body':
        return data.body.split("\n");
    }

    return super.resolve(data, key);
  }
}
