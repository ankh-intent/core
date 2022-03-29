import { PrimitiveLiteral } from '../../../../../../../modules';
import { PrimitiveNode } from '../../../../../../ast';
import { NodeTranslator } from '../../../../../NodeTranslator';

export type PrimitiveTranslatorChildren = {
};

export class PrimitiveTranslator extends NodeTranslator<PrimitiveLiteral, PrimitiveTranslatorChildren> {
  translate(node: PrimitiveNode, c): PrimitiveLiteral {
    return PrimitiveLiteral.create(node, c.parent, {
      type: node.type,
      value: node.value,
    });
  }
}
