import { Translated } from '@intent/translator';
import { DomainInterfacePropertyNode } from '@alchemy/ast';
import { ReferenceInterface } from '../../interfaces';
import { Expression } from '../functor';

export class InterfaceProperty extends Translated<DomainInterfacePropertyNode> {
    public identifier: string;
    public expression: Expression | null;
    public type: ReferenceInterface | null;

    toString() {
        return `${
            this.identifier
        }${
            this.type ? `: ${this.type}` : ''
        }${
            this.expression ? `= ${this.expression}` : ''
        }`;
    }
}
