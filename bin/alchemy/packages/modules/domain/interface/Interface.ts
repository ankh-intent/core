import { Strings } from '@intent/kernel';
import { Translated } from '@intent/translator';
import { DomainInterfaceNode } from '@alchemy/ast';
import { InterfaceProperty } from './InterfaceProperty';

export class Interface extends Translated<DomainInterfaceNode> {
    public properties: Map<string, InterfaceProperty> = new Map();

    toString() {
        if (!this.properties.size) {
            return '';
        }

        const body = Strings
            .indent(
                [...this.properties.values()].map((prop) => `${prop},`)
                    .join('\n')
                    .split('\n'),
                '  ',
            )
            .join('\n');

        return `{\n${body}\n}`;
    }
}
