import { FunctorArgsNode, ReferenceNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type FunctorArgsTranslatorChildren = {
  type: ReferenceNode;
};

export class FunctorArgsTranslator extends NodeTranslator<FunctorArgsNode, FunctorArgsTranslatorChildren> {
  translate(node: FunctorArgsNode, context): string {
    return `{${this.wrapInlineList(
      node.args.map((arg) => `${arg.name}: ${this.child.type(arg.type, context)}`),
      ', ',
      ' ',
    )}}`;
  }
}
