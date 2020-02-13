import { FunctorArgsNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface FunctorArgsSerializerChildren {
}

export class FunctorArgsSerializer extends NodeSerializer<FunctorArgsNode, FunctorArgsSerializerChildren> {
  serialize(node: FunctorArgsNode): string {
    return `${Object.entries(node.args).map(([arg, type]) => (
      `${arg}: ${type}`
    ))}`;
  }
}
