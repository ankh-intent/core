import { InterfaceProperty } from '../../../../modules';
import { ReferenceNode, DomainInterfacePropertyNode, ExpressionNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type InterfacePropertyTranslatorChildren = {
  reference: ReferenceNode;
  expression: ExpressionNode;
};

export class InterfacePropertyTranslator extends NodeTranslator<InterfaceProperty, InterfacePropertyTranslatorChildren> {
  translate(node: DomainInterfacePropertyNode, c): InterfaceProperty {
    return InterfaceProperty.create(node, c.parent, {
      identifier: node.identifier,
      type: node.type && this.child.reference(node.type, c),
      expression: node.expression && this.child.expression(node.expression, c),
    });
  }
}
