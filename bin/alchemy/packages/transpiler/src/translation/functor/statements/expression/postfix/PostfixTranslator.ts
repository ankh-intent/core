import { TranslationContext } from '@intent/translator';
import { Postfix } from '@alchemy/modules';
import { ReferenceNode, PostfixNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../../AlchemyNodeTranslator';

export type PostfixTranslatorChildren = {
    reference: ReferenceNode;
};

export class PostfixTranslator extends AlchemyNodeTranslator<Postfix, PostfixTranslatorChildren> {
    translate(node: PostfixNode, context: TranslationContext<any>): Postfix {
        return Postfix.create(node, context.parentNode, {
            operation: node.operation,
        });
    }
}
