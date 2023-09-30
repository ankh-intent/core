import { Translated } from '@intent/translator';
import { FunctorNode } from '@alchemy/ast';
import { ReferenceInterface, GenericsInterface } from '../../interfaces';
import { FunctorArgs } from './FunctorArgs';
import { FunctorBody } from './FunctorBody';

export class Functor extends Translated<FunctorNode> {
    public args: FunctorArgs;
    public returns: ReferenceInterface | null;
    public generic: GenericsInterface | null;
    public body: FunctorBody;

    toString() {
        return `${!this.generic?.isEmpty ? this.generic : ''}(${this.args}): ${this.returns || 'void'} => ${this.body}`;
    }
}
