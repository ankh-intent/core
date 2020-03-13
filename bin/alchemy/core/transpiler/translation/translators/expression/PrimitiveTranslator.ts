import { LiteralNode, LiteralType } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type PrimitiveTranslatorChildren = {
};

export class PrimitiveTranslator extends NodeTranslator<LiteralNode, PrimitiveTranslatorChildren> {
  translate(node: LiteralNode): string {
    switch (node.type) {
      case LiteralType.Number: return node.value;
      case LiteralType.String: return node.value;
    }
  }
}
