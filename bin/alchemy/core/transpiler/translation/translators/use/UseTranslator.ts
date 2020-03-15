import { Use } from '../../../../modules';
import { UseNode, QualifierNode, DecompositionNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type UseTranslatorChildren = {
  qualifier: QualifierNode;
  decomposition: DecompositionNode;
};

export class UseTranslator extends NodeTranslator<Use, UseTranslatorChildren> {
  translate(node: UseNode, c): Use {
    return Use.create(node, c.parent, {
      decomposition: this.child.decomposition(node.decomposition, c),
    });
  }
}
