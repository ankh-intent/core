import { ReferenceNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type DomainInterfaceTranslatorChildren = {
  type: ReferenceNode;
};

export class DomainInterfaceTranslator extends NodeTranslator<ReferenceNode, DomainInterfaceTranslatorChildren> {
  translate(node: ReferenceNode, context): string {
    return `${node.isArray ? 'Array<' : ''}${node.qualifier.path()}${this.serializeGeneric(node, context)}${node.isArray ? '>' : ''}`;
  }

  serializeGeneric(node: ReferenceNode, context) {
    return (
      (node.generic && node.generic.genericTypes.length)
        ? `<${this.wrapInlineList(node.generic.genericTypes.map((child) => this.child.type(child, context)))}>`
        : ''
    );
  }
}
