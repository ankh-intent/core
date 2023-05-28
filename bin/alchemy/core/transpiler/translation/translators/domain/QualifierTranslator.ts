import { Qualifier } from '../../../../modules';
import { QualifierNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type QualifierTranslatorChildren = {
    qualifier: QualifierNode;
};

export class QualifierTranslator extends NodeTranslator<Qualifier, QualifierTranslatorChildren> {
    translate(node: QualifierNode, c): Qualifier {
        const { node: qualifier, context } = c.spawn(Qualifier, node);

        qualifier.name = node.name;
        qualifier.child = node.child && this.child.qualifier(node.child, context);

        return qualifier;
    }
}
