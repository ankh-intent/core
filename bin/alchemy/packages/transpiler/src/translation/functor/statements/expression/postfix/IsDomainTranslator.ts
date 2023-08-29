import { TranslationContext } from '@intent/translator';
import { IsDomain } from '@alchemy/modules';
import { IsDomainNode, ReferenceNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../../AlchemyNodeTranslator';

export type IsDomainTranslatorChildren = {
    reference: ReferenceNode;
};

export class IsDomainTranslator extends AlchemyNodeTranslator<IsDomain, IsDomainTranslatorChildren> {
    translate(node: IsDomainNode, context: TranslationContext<any>): IsDomain {
        return IsDomain.create(node, context.parentNode, {
            right: this.child.reference(node.right, context),
        });
    }
}
