
import { AbstractTranspiler, TranspilerInterface } from './AbstractTranspiler';
import { CanNode } from '../../../../../intent/ast/CanNode';
import { TypeTranspiler } from './TypeTranspiler';
import { PropertyTranspiler } from './PropertyTranspiler';
import { Container } from '../../../../transpiler/Container';

export class CanTranspiler extends AbstractTranspiler<CanNode> {
  protected visitors: Container<TranspilerInterface<any>> = {
    returns: new TypeTranspiler(this.compiler),
    args: new PropertyTranspiler(this.compiler),
  };

  protected get code(): string {
    return `
      public {%name%}({%*args|.join(", ")%}): {%returns|.pop()||'any'%} {
        {%body%} 
      }`;
  }

  public resolve(data: CanNode, key: string): any {
    switch (key) {
      case 'body':
        return data.body.split("\n");
    }

    return super.resolve(data, key);
  }
}
