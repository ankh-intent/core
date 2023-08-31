import { TranslationContext } from '@intent/translator';
import { Generics } from '@alchemy/modules';
import { GenericTemplateNode, GenericTemplatesNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type GenericsTranslatorChildren = {
    template: GenericTemplateNode;
};

export class GenericsTranslator extends AlchemyNodeTranslator<Generics, GenericsTranslatorChildren> {
    translate(node: GenericTemplatesNode, context: TranslationContext<any>): Generics {
        return Generics.create(node, context.parentNode, {
            templates: node.templates.map((template) => this.child.template(template, context)),
        });
    }
}
