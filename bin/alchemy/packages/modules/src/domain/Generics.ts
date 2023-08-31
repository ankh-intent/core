import { Translated } from '@intent/translator';
import { GenericTemplatesNode } from '@alchemy/ast';
import { GenericInterface, GenericsInterface } from '../interfaces';

export class Generics extends Translated<GenericTemplatesNode> implements GenericsInterface {
    templates: GenericInterface[];

    get isEmpty() {
        return !this.templates.length;
    }

    toString() {
        return this.isEmpty ? '' : `<${this.templates.join(', ')}>`;
    }
}
