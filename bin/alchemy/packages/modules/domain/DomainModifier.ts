import { Translated } from '@intent/translator';
import { DomainModifierNode } from '@alchemy/ast';

export class DomainModifier extends Translated<DomainModifierNode> {
    public isNative: boolean = false;
    public isAbstract: boolean = false;
    public isAugment: boolean = false;

    get isSpecial() {
        return this.isNative || this.isAbstract || this.isAugment;
    }

    toString() {
        if (!this.isSpecial) {
            return '';
        }

        const parts: string[] = [];

        if (this.isNative) {
            parts.push('native');
        }

        if (this.isAbstract) {
            parts.push('abstract');
        }

        if (this.isAugment) {
            parts.push('augment');
        }

        return parts.join(' ');
    }
}
