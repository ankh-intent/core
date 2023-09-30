import { Translated } from '@intent/translator';
import { GenericTemplateNode } from '@alchemy/ast';
import { GenericInterface, ReferenceInterface, DomainInterface } from '../interfaces';

export class Generic extends Translated<GenericTemplateNode> implements GenericInterface {
    identifier: string;
    domain: DomainInterface;
    defaultsTo?: ReferenceInterface;

    toString() {
        return `${this.identifier}${this.domain.parent ? `: ${this.domain.parent}` : ''}${this.defaultsTo ? ` = ${this.defaultsTo}` : ''}`;
    }
}
