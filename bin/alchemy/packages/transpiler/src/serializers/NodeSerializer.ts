import { TreeNode } from '@intent/kernel';
import { NodeIdentifiersMap } from '@intent/plugins';
import { NodeSerializer as Base } from '@intent/translator';
import { SerializingContext } from './SerializingContext';

export abstract class NodeSerializer<N extends TreeNode, I extends NodeIdentifiersMap> extends Base<N, I, SerializingContext> {
    protected defaultConfig = {
        glue: '\n',
        surround: '\n',
        indent: true,
    };
}
