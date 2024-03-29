import { TokenMatcher } from '@intent/kernel';

import { DomainNode, ModuleNode, UsesNode } from '@alchemy/ast';
import { BaseBuilder } from './BaseBuilder';

export type ModuleChildren = {
    domain: DomainNode;
    uses: UsesNode;
};

export class ModuleBuilder extends BaseBuilder<ModuleNode, ModuleChildren> {
    protected build(tokens: TokenMatcher) {
        const uses = this.child.uses(tokens);
        const domain = this.child.domain(tokens);

        if (!domain) {
            throw this.error(tokens, 'module', 'Domain declaration expected');
        }

        return new ModuleNode(
            tokens.source.reference,
            uses,
            domain,
        );
    }
}
