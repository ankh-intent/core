import path = require('path');

import { CoreConfig } from '../../../CoreConfig';
import { TreeNode } from '../../../kernel/ast/TreeNode';
import { Identifiable } from '../../../kernel/dependencies/DependencyNode';
import { BaseEmitResolver } from './BaseEmitResolver';

export class InternalEmitResolver<N extends TreeNode, T extends Identifiable<N>> extends BaseEmitResolver<N, T> {
  private readonly append: string;

  constructor(config: CoreConfig, append: string) {
    super(config);
    this.append = append;
  }

  protected getBasePath(identifiable: T): string {
    return this.config.paths.internal;
  }

  protected getOutputPath(identifiable: T): string {
    return path.join(
      this.config.output.path,
      this.append,
    );
  }

  protected isInternal(identifiable: T): boolean {
    const original = this.getOriginalPath(identifiable);
    const base = this.getBasePath(identifiable);

    return original.indexOf(base) >= 0;
  }

  public resolve(identifiable: T): string|null {
    return (
      this.isInternal(identifiable)
        ? super.resolve(identifiable)
        : null
    );
  }
}
