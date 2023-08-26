import { ReferenceNode } from '@alchemy/ast';
import { ReferenceInterface, DomainInterface } from '../interfaces';
import { Translated } from '../Translated';
import { Qualifier } from './Qualifier';

export class DomainReference extends Translated<ReferenceNode> implements ReferenceInterface {
    public domain: DomainInterface;
    public qualifier: Qualifier;
    public generics: DomainReference[];

    toString() {
        return `${this.domain.identifier}${this.generics.length ? `<${this.generics.join(', ')}>` : ''}`;
    }
}
