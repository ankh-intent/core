import { FunctorArgsNode, TypeNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export type FunctorArgsSerializerChildren = {
  type: TypeNode;
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
