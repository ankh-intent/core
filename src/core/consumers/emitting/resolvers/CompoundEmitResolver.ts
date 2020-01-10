import { TreeNode } from '../../../kernel/ast';
import { Identifiable } from '../../../kernel/dependencies/DependencyNode';
import { FileEmitResolverInterface } from '../InterpretedConsumer';

export class CompoundEmitResolver<N extends TreeNode, T extends Identifiable<N>> implements FileEmitResolverInterface<N, T> {
  public readonly resolvers: FileEmitResolverInterface<N, T>[];

  public constructor(resolvers: FileEmitResolverInterface<N, T>[]) {
    this.resolvers = resolvers;
  }

  public resolve(identifiable: T): string|null {
    for (const resolver of this.resolvers) {
      const found = resolver.resolve(identifiable);

      if (found) {
        return found;
      }
    }

    return null;
  }
}
