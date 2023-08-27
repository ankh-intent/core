import { TranslationContext } from '@intent/translator';
import { PrimitiveLiteral } from '@alchemy/modules';
import { PrimitiveNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../../AlchemyNodeTranslator';

export type PrimitiveTranslatorChildren = {};

export class PrimitiveTranslator extends AlchemyNodeTranslator<PrimitiveLiteral, PrimitiveTranslatorChildren> {
    translate(node: PrimitiveNode, context: TranslationContext<any>): PrimitiveLiteral {
        return PrimitiveLiteral.create(node, context.parent, {
            type: node.type,
            value: node.value,
        });
    }
}
