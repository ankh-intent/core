import { Strings } from '@intent/kernel';
import { Translated } from '@intent/translator';

import { DecompositionNode } from '@alchemy/ast';
import { Qualifier } from '../../reference';

export class Decomposition extends Translated<DecompositionNode> {
    public qualifier: Qualifier;
    public alias: string;
    public items: { [qualifier: string]: Decomposition };

    toString() {
        const parts: string[] = [];

        if (Object.keys(this.items).length) {
            parts.push(Object.values(this.items).map((decomposition) => `${decomposition},`).join('\n'));
        }

        const body = Strings.indent(String(parts.join('\n')).split('\n'), '  ').join('\n');

        return `${this.qualifier}${
            body.trim() ? `: {\n${body}\n}` : ''
        }${(this.alias !== String(this.qualifier)) ? ` as ${this.alias}` : ''}`;
    }
}
