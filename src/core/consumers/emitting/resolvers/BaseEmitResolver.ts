import path = require('path');

import { Strings } from '../../../utils/Strings';
import { CoreConfig } from '../../../CoreConfig';
import { TreeNode } from '../../../kernel/ast/TreeNode';
import { Identifiable } from '../../../kernel/dependencies/DependencyNode';
import { FileEmitResolverInterface } from '../InterpretedConsumer';

export class BaseEmitResolver<N extends TreeNode, T extends Identifiable<N>> implements FileEmitResolverInterface<N, T> {
  protected readonly config: CoreConfig;

  public constructor(config: CoreConfig) {
    this.config = config;
  }

  protected getOriginalPath(identifiable: T): string {
    return identifiable.identifier;
  }

  protected getBasePath(identifiable: T): string {
    return this.config.paths.project;
  }

  protected getOutputPath(identifiable: T): string {
    return this.config.output.path;
  }

  public resolve(identifiable: T): string {
    return this.build(
      this.getOriginalPath(identifiable),
      this.getBasePath(identifiable),
      this.getOutputPath(identifiable)
    );
  }

  protected build(original: string, base: string, out: string) {
    const parts = path.parse(original);
    const emit = path.join(parts.dir, parts.name + this.config.output.extension);
    const common = Strings.longestCommon([emit, base])
      .pop()
      .replace(new RegExp(`${Strings.escapeRegExp(path.sep)}$`), '')
    ;

    return emit.replace(common, out);
  }
}
