import { TreeWalker } from '@intent/kernel/tree';

import { ModuleNode } from '../ast';

export abstract class RootSerializer<G> extends TreeWalker<ModuleNode, string, G> {
}
