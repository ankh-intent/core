import { TreeNode } from '@intent/kernel';
import { Walker, NodeIdentifiersMap } from '@intent/plugins';
import { Strings } from '@intent/utils';
import { SerializingContext } from './SerializingContext';

interface WrapConfig {
    glue: string;
    surround: string;
    indent: boolean;
}

export abstract class NodeSerializer<N extends TreeNode, I extends NodeIdentifiersMap> extends Walker<N, SerializingContext, string, I> {
    defaultConfig: WrapConfig = {
        glue: '\n',
        surround: '\n',
        indent: true,
    };

    visit(node: N, context: SerializingContext): string {
        return this.serialize(node, context);
    }

    wrapInlineList(list: any[], separator: string = ', ', surround: string = '') {
        return this.wrap(list, { surround, glue: separator, indent: false });
    }

    wrapStatements(list: any[]) {
        return this.wrap(list, { surround: '', indent: false });
    }

    wrap(items: any[], config?: Partial<WrapConfig>): string {
        const resolved = config ? { ...this.defaultConfig, ...config } : this.defaultConfig;

        let filtered = (
            Strings
                .fold(
                    <string[][]>items
                        .map((item) => item && typeof item === 'string' && String(item).split('\n'))
                        .filter(Boolean),
                )
                .filter(Boolean)
        );

        if (resolved.indent) {
            filtered = Strings.indent(filtered, '  ');
        }

        return resolved.surround + filtered.join(resolved.glue) + resolved.surround;
    }

    protected get name(): string {
        return Strings.camelCaseToSnakeCase(
            this.constructor.name.replace(/Serializer$/, ''),
        );
    }

    abstract serialize(node: N, context: SerializingContext): string;
}
