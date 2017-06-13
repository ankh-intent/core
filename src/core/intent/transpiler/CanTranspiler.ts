
import { CanNode } from "../ast/CanNode";
import { AbstractCompoundTemplate } from '../../flow/transpiler/templates/CompoundTemplate';

export class CanTranspiler extends AbstractCompoundTemplate<CanNode> {
  public get code(): string {
    return `
      {%name%}({%args%})/*: {%=returns%}*/ {
        {%body%} 
      }`;
  }
}
