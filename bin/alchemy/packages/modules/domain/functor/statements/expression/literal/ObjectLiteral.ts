import { Strings } from '@intent/kernel';
import { Translated } from '@intent/translator';
import { ObjectNode } from '@alchemy/ast';

import { ObjectProperty } from './ObjectProperty';

export class ObjectLiteral extends Translated<ObjectNode> {
    public properties: Map<string, ObjectProperty> = new Map();

    toString() {
        const props = [...this.properties.values()]
            .map((prop) => Strings.indent(`${prop},`.split('\n'), '  ').join('\n'))
            .join('\n');

        return `{${
            props.trim()
                ? `\n${props}\n`
                : ''
        }}`;
    }
}
