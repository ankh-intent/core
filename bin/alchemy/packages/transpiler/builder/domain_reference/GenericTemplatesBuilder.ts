import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/parser';

import { GenericTemplatesNode, GenericTemplateNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type GenericTemplatesChildren = {
    generic_template: GenericTemplateNode;
};

export class GenericTemplatesBuilder extends BaseBuilder<GenericTemplatesNode, GenericTemplatesChildren> {
    protected build(tokens: TokenMatcher, { get, peek, ensure }: TypedTokenMatcherInterface) {
        const templates: GenericTemplateNode[] = [];

        if (get.symbol('<')) {
            while (true) {
                if (templates.length) {
                    if (!peek.symbol(',')) {
                        break;
                    }

                    ensure.symbol(',');
                }

                const template = this.child.generic_template(tokens);

                if (template) {
                    templates.push(template);
                } else {
                    break;
                }
            }

            ensure.symbol('>');
        }

        return new GenericTemplatesNode(
            templates,
        );
    }
}
