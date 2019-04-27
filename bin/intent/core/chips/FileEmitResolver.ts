
import path = require('path');

import { Strings } from '@intent/utils/Strings';
import { FileEmitResolverInterface } from '@intent/consumers/emitting/InterpretedConsumer';

import { ChipNode } from '../transpiler/ast/ChipNode';
import { Chip } from './Chip';
import { TranspilerConfig } from '../TranspilerPipelineObserver';

class BaseFileEmitResolver implements FileEmitResolverInterface<ChipNode, Chip> {
  protected readonly config: TranspilerConfig;

  public constructor(config: TranspilerConfig) {
    this.config = config;
  }

  protected getOriginalPath(chip: Chip): string {
    return chip.identifier;
  }

  protected getBasePath(chip: Chip): string {
    return this.config.paths.project;
  }

  protected getOutputPath(chip: Chip): string {
    return this.config.output.path;
  }

  public resolve(chip: Chip): string {
    return this.build(
      this.getOriginalPath(chip),
      this.getBasePath(chip),
      this.getOutputPath(chip)
    );
  }

  protected build(original: string, base: string, out: string) {
    const parts = path.parse(original);
    const emit = path.join(parts.dir, parts.name + this.config.output.extension);
    const common = Strings.longestCommon([emit, base])
      .pop()
      .replace(new RegExp(`\\${path.sep}$`), '')
    ;

    return emit.replace(common, out);
  }
}

class IntentFileEmitResolver extends BaseFileEmitResolver {
  static APPEND = '@lib';

  protected getBasePath(chip: Chip): string {
    return this.config.resolver.paths.intent;
  }

  protected getOutputPath(chip: Chip): string {
    return path.join(
      this.config.output.path,
      (<typeof IntentFileEmitResolver>this.constructor).APPEND
    );
  }

  public resolve(chip: Chip): string {
    const original = this.getOriginalPath(chip);
    const base = this.getBasePath(chip);

    return (
      (original.indexOf(base) < 0)
        ? null
        : super.resolve(chip)
    );
  }
}

export class FileEmitResolver extends BaseFileEmitResolver {
  public readonly resolvers: FileEmitResolverInterface<ChipNode, Chip>[];

  public constructor(config: TranspilerConfig) {
    super(config);
    this.resolvers = [
      new IntentFileEmitResolver(config),
    ]
  }

  public resolve(chip: Chip): string {
    for (const resolver of this.resolvers) {
      const found = resolver.resolve(chip);

      if (found) {
        return found;
      }
    }

    return super.resolve(chip);
  }
}
