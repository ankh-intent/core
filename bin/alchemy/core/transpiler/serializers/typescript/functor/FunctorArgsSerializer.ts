import { FunctorArgsNode, ReferenceNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export type FunctorArgsSerializerChildren = {
  type: ReferenceNode;
};

export class FunctorArgsSerializer extends NodeSerializer<FunctorArgsNode, FunctorArgsSerializerChildren> {
  serialize(node: FunctorArgsNode, context): string {
    return `{${this.wrapInlineList(
      node.args.map((arg) => `${arg.name}: ${this.child.type(arg.type, context)}`),
      ', ',
      ' ',
    )}}`;
  }
}
