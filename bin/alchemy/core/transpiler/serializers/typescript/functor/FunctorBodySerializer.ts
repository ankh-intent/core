import { FunctorBodyNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface FunctorBodySerializerChildren {
}

export class FunctorBodySerializer extends NodeSerializer<FunctorBodyNode, FunctorBodySerializerChildren> {
  serialize(node: FunctorBodyNode): string {
    return `${node.block.astRegion.extract()}`;
  }
}
