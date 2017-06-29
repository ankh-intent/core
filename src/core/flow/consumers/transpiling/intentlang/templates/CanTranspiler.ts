
import { AbstractTranspiler } from './AbstractTranspiler';
import { CanNode } from '../../../../../intent/ast/CanNode';

export class CanTranspiler extends AbstractTranspiler<CanNode> {
  protected get code(): string {
    return `
      {%name%}({%args%})/*: {%returns%}*/ {
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
