
import path = require('path');
import { Strings } from '@intent/utils/Strings';

import { TranspilerConfig } from '../Transpiler';
import { Chip } from './Chip';

export interface FileEmitResolverInterface {

  resolve(from: Chip): string;

}

class BaseFileEmitResolver implements FileEmitResolverInterface {
  protected readonly config: TranspilerConfig;

  public constructor(config: TranspilerConfig) {
    this.config = config;
  }

  protected getOriginalPath(chip: Chip): string {
    return chip.path;
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
    let parts = path.parse(original);
    let emit = path.join(parts.dir, parts.name + this.config.output.extension);
    let common = Strings.longestCommon([emit, base])
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
    let original = this.getOriginalPath(chip);
    let base = this.getBasePath(chip);

    return (
      (original.indexOf(base) < 0)
        ? null
        : super.resolve(chip)
    );
  }
}

export class FileEmitResolver extends BaseFileEmitResolver {
  public readonly resolvers: FileEmitResolverInterface[];

  public constructor(config: TranspilerConfig) {
    super(config);
    this.resolvers = [
      new IntentFileEmitResolver(config),
    ]
  }

  public resolve(chip: Chip): string {
    let found;

    for (let resolver of this.resolvers) {
      if (found = resolver.resolve(chip)) {
        return found;
      }
    }

    return super.resolve(chip);
  }
}
