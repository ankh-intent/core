import { BlockNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export class EmptyBlockBuilder extends BaseBuilder<BlockNode, {}> {
    protected build() {
        return new BlockNode();
    }
}
