import { Core } from './Core';
import { CoreConfig } from '../CoreConfig';
import { TreeNode, Identifiable } from '../kernel';

export interface PipelineObserver<C extends CoreConfig, N extends TreeNode, T extends Identifiable<N>> {
  bootstrap(core: Core<C, N, T>, config: C): void;
}

export interface PipelineObserverFactory<C extends CoreConfig, N extends TreeNode, T extends Identifiable<N>> {
  (core: Core<C, N, T>, config: C): PipelineObserver<C, N, T>;
}
