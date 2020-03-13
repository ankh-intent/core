import path = require('path');

import { Strings } from '@intent/utils';

import { CoreConfig } from '../../CoreConfig';
import { TreeNode } from '@intent/ast';
import { Identifiable } from '../dependencies';

import { FileEmitResolverInterface } from './FileEmitResolverInterface';

export class BaseEmitResolver<N extends TreeNode, T extends Identifiable<N>> implements FileEmitResolverInterface<N, T> {
  protected readonly config: CoreConfig;

  public constructor(config: CoreConfig) {
    this.config = config;
  }

  protected getOriginalPath(identifiable: T): string {
    return identifiable.uri;
  }

  protected getBasePath(identifiable: T): string {
    return this.config.paths.project;
  }

  protected getOutputPath(identifiable: T): string {
    return this.config.output.path;
  }

  public resolve(identifiable: T): string|null {
    return this.build(
      this.getOriginalPath(identifiable),
      this.getBasePath(identifiable),
      this.getOutputPath(identifiable)
    );
  }

  protected build(original: string, base: string, out: string): string|null {
    const parts = path.parse(original);
    const emit = path.join(parts.dir, parts.name + this.config.output.extension);
    const common = Strings.commonPath([emit, base]);

    return (
      common
        ? emit.replace(common, out)
        : emit
    );
  }
}
