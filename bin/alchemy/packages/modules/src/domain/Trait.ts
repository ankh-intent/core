import { Translated } from '@intent/translator';
import { TraitNode, DomainNode } from '@alchemy/ast';
import { DomainInterface } from '../interfaces';

export class Trait extends Translated<TraitNode<DomainNode>> {
    public domain: DomainInterface;

    toTypeString() {
        return this.domain.toTypeString();
    }

    toString() {
        return `trait ${this.domain}`;
    }
}
