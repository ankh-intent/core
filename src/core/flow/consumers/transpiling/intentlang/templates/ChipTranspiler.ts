
import { AbstractTranspiler } from './AbstractTranspiler';
import { ChipNode } from '../../../../../intent/ast/ChipNode';

export class ChipTranspiler extends AbstractTranspiler<ChipNode> {
  protected get code(): string {
    return `
      (() => { 
        {%domains%}
        {%can%}
      
        return {
          {%names%},
        };
      })();
    `;
  }
}
