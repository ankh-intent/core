import { FunctorArgsNode, TypeNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface FunctorArgsSerializerChildren {
  type: TypeNode;
}

export class FunctorArgsSerializer extends NodeSerializer<FunctorArgsNode, FunctorArgsSerializerChildren> {
  serialize(node: FunctorArgsNode): string {
    return this.wrapInlineList(node.args.map((arg) => `$arg_${arg.name}: ${this.child.type(arg.type)}`));
  }
}
