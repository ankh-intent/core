import { Postfix } from '../../../../../../../modules';
import { ReferenceNode, PostfixNode } from '../../../../../../ast';
import { NodeTranslator } from '../../../../../NodeTranslator';
import { TranslationContext } from '../../../../../TranslationContext';

export type PostfixTranslatorChildren = {
    reference: ReferenceNode;
};

export class PostfixTranslator extends NodeTranslator<Postfix, PostfixTranslatorChildren> {
    translate(node: PostfixNode, context: TranslationContext<any>): Postfix {
        return Postfix.create(node, context.parent, {
            operation: node.operation,
        });
    }
}
