
import { AbstractTranspiler } from '../../flow/transpiler/AbstractTranspiler';
import { UseNode } from '../ast/UseNode';

export class UseTranspiler extends AbstractTranspiler<UseNode, string> {
  public process(use: UseNode) {
    let full = use.qualifier.path('.');

    return (use.alias !== use.qualifier.deepest())
      ? `use ${full} as ${use.alias};`
      : `use ${full};`;
  }
}
