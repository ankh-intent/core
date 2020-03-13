import { IdentifierNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type IdentifierTranslatorChildren = {
};

export class IdentifierTranslator extends NodeTranslator<IdentifierNode, IdentifierTranslatorChildren> {
  translate(node: IdentifierNode, context): string {
    return context.getLocalIdentifier(node.name) || `/* unknown */ ${node.name}`;
  }
}
