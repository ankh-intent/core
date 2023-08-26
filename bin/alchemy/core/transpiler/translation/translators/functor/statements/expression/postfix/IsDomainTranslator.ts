import { IsDomain } from '../../../../../../../modules';
import { IsDomainNode, ReferenceNode } from '../../../../../../ast';
import { NodeTranslator } from '../../../../../NodeTranslator';
import { TranslationContext } from '../../../../../TranslationContext';

export type IsDomainTranslatorChildren = {
    reference: ReferenceNode;
};

export class IsDomainTranslator extends NodeTranslator<IsDomain, IsDomainTranslatorChildren> {
    translate(node: IsDomainNode, context: TranslationContext<any>): IsDomain {
        return IsDomain.create(node, context.parent, {
            right: this.child.reference(node.right, context),
        });
    }
}
