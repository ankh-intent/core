import { PrimitiveLiteral } from '../../../../../../../modules';
import { PrimitiveNode } from '../../../../../../ast';
import { NodeTranslator } from '../../../../../NodeTranslator';
import { TranslationContext } from '../../../../../TranslationContext';

export type PrimitiveTranslatorChildren = {};

export class PrimitiveTranslator extends NodeTranslator<PrimitiveLiteral, PrimitiveTranslatorChildren> {
    translate(node: PrimitiveNode, context: TranslationContext<any>): PrimitiveLiteral {
        return PrimitiveLiteral.create(node, context.parent, {
            type: node.type,
            value: node.value,
        });
    }
}
