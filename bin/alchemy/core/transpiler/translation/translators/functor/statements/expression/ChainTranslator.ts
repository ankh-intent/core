import { ChainNode, IdentifierNode } from '../../../../../ast';
import { NodeTranslator } from '../../../../NodeTranslator';

export type ChainTranslatorChildren = {
  identifier: IdentifierNode;
};

export class ChainTranslator extends NodeTranslator<ChainNode, ChainTranslatorChildren> {
  translate(node: ChainNode, context): string {
    return '.' + node.right.name;
  }
}
