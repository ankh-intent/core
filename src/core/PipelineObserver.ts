import { Core } from './Core';
import { CoreConfig } from './CoreConfig';
import { TreeNode } from './kernel/ast/TreeNode';
import { Identifiable } from './kernel/dependencies/DependencyNode';

export interface PipelineObserver<C extends CoreConfig, N extends TreeNode, T extends Identifiable<N>> {
  bootstrap(core: Core<C, N, T>, config: C): void;
}

export interface PipelineObserverFactory<C extends CoreConfig, N extends TreeNode, T extends Identifiable<N>> {
  (core: Core<C, N, T>, config: C): PipelineObserver<C, N, T>;
}
