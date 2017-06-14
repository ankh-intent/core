
import { AbstractCompoundTemplate } from "../../flow/transpiler/templates/CompoundTemplate";
import { UseNode } from '../ast/UseNode';

export class UseTranspiler extends AbstractCompoundTemplate<UseNode> {
  public get code(): string {
    return `use {%.qualifier%} as {%.alias%}>`;
  }
}
