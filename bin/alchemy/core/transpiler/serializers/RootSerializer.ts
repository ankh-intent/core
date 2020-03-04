import { TreeWalker } from '@intent/kernel/tree';

import { ModuleNode } from '../ast';
import { SerializingContext } from './SerializingContext';

export abstract class RootSerializer<G> extends TreeWalker<ModuleNode, SerializingContext, string, G> {
}
