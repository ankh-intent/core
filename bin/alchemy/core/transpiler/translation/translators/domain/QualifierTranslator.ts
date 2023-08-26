import { Qualifier } from '../../../../modules';
import { QualifierNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';
import { TranslationContext } from '../../TranslationContext';

export type QualifierTranslatorChildren = {
    qualifier: QualifierNode;
};

export class QualifierTranslator extends NodeTranslator<Qualifier, QualifierTranslatorChildren> {
    translate(node: QualifierNode, context: TranslationContext<any>): Qualifier {
        const { node: qualifier, context: inner } = context.spawn(Qualifier, node);

        qualifier.name = node.name;
        qualifier.child = node.child && this.child.qualifier(node.child, inner);

        return qualifier;
    }
}
