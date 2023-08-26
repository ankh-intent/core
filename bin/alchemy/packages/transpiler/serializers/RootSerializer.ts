import { TreeWalker } from '@intent/plugins';

import { ModuleNode } from '@alchemy/ast';
import { SerializingContext } from './SerializingContext';

export abstract class RootSerializer<G> extends TreeWalker<ModuleNode, SerializingContext, string, G> {
}
