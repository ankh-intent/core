import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';
import { DomainModifierNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type DomainModifierChildren = {};

export class DomainModifierBuilder extends BaseBuilder<DomainModifierNode, DomainModifierChildren> {
    protected build(_tokens: TokenMatcher, { ensure, peek }: TypedTokenMatcherInterface) {
        let identifier;
        let isNative = false;
        let isAbstract = false;
        let isAugment = false;

        while ((identifier = peek.identifier())) {
            switch (identifier) {
                case 'native': isNative = true; break;
                case 'abstract': isAbstract = true; break;
                case 'augment': isAugment = true; break;
                default:
                    identifier = undefined;
            }

            if (identifier) {
                ensure.identifier();
            } else {
                break;
            }
        }

        return new DomainModifierNode(
            isNative,
            isAbstract,
            isAugment
        );
    }
}
