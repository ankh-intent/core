
import path = require('path');

import { Strings } from '../../intent-utils/Strings';
import { CoreOptions } from '../../Core';
import { Chip } from './Chip';

export interface FileEmitResolverInterface {

  resolve(from: Chip): string;

}

class BaseFileEmitResolver implements FileEmitResolverInterface {
  protected options: CoreOptions;

  public constructor(options: CoreOptions) {
    this.options = options;
  }

  protected getOriginalPath(chip: Chip): string {
    return chip.path;
  }

  protected getBasePath(chip: Chip): string {
    return this.options.resolver.paths.project;
  }

  protected getOutputPath(chip: Chip): string {
    return this.options.resolver.paths.output;
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
    let emit = path.join(parts.dir, parts.name + this.options.emit.extension);
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
    return this.options.resolver.paths.intent;
  }

  protected getOutputPath(chip: Chip): string {
    return path.join(
      this.options.resolver.paths.output,
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
  public resolvers: FileEmitResolverInterface[];

  public constructor(options: CoreOptions) {
    super(options);
    this.resolvers = [
      new IntentFileEmitResolver(options),
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
