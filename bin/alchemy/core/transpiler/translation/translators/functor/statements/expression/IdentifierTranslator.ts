import { Identifier } from '../../../../../../modules';
import { IdentifierNode } from '../../../../../ast';
import { NodeTranslator } from '../../../../NodeTranslator';

export type IdentifierTranslatorChildren = {
};

export class IdentifierTranslator extends NodeTranslator<Identifier, IdentifierTranslatorChildren> {
  translate(node: IdentifierNode, c): Identifier {
    return Identifier.create(node, c.parent, {
      name: node.name,
    });
  }
}
