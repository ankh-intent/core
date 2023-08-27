import { AbstractNode } from '@intent/kernel';
import { TranslationContext, Translated } from '@intent/translator';
import { PrimitiveNode, ObjectNode, ArrayNode, CallableNode, IdentifierNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../../AlchemyNodeTranslator';

export type LiteralTranslatorChildren = {
    primitive: PrimitiveNode;
    object_literal: ObjectNode;
    array_literal: ArrayNode;
    callable: CallableNode;
    identifier: IdentifierNode;
};

export class LiteralTranslator extends AlchemyNodeTranslator<Translated<any>, LiteralTranslatorChildren> {
    translate(node: AbstractNode, context: TranslationContext<any>): Translated<any> {
        if (node instanceof PrimitiveNode) {
            return this.child.primitive(node, context);
        } else if (node instanceof ObjectNode) {
            return this.child.object_literal(node, context);
        } else if (node instanceof ArrayNode) {
            return this.child.array_literal(node, context);
        } else if (node instanceof CallableNode) {
            return this.child.callable(node, context);
        } else if (node instanceof IdentifierNode) {
            return this.child.identifier(node, context);
        }

        throw new Error(`Unknown literal "${node.node}"`);
    }
}
