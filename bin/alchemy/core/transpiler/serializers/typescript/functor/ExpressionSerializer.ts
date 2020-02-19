import { ExpressionNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface ExpressionSerializerChildren {
}

export class ExpressionSerializer extends NodeSerializer<ExpressionNode, ExpressionSerializerChildren> {
  serialize(node: ExpressionNode): string {
    return node.astRegion.extract();
  }
}
