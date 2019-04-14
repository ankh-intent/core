import { Strings } from '@intent/utils/Strings';

import { UseResolverInterface } from './UseResolverInterface';
import { TranspilerConfig } from '../../TranspilerPipelineObserver';
import { IntentLibraryUseResolver } from './IntentLibraryUseResolver';
import { Chip } from '../Chip';
import { QualifierNode } from '../../transpiler/ast/QualifierNode';

export class BaseUseResolver implements UseResolverInterface {
  private config: TranspilerConfig;
  public resolvers: UseResolverInterface[];

  public constructor(config: TranspilerConfig) {
    this.config = config;
    this.resolvers = [
      new IntentLibraryUseResolver(config.resolver),
    ]
  }

  public resolve(from: Chip, identifier: QualifierNode): Chip {
    for (const resolver of this.resolvers) {
      const found = resolver.resolve(from, identifier);

      if (found) {
        return found;
      }
    }

    const search = identifier.name;

    for (const found of Object.keys(from.linked).map((name) => from.linked[name])) {
      if (search === found.name) {
        return identifier.child
          ? this.resolve(found, identifier.child)
          : found;
      }
    }

    const common = Strings.longestCommon([this.config.paths.project, from.identifier]).pop();
    const resolved = from.identifier
        .replace(new RegExp(`^${common}`), '')
        .replace(/\/[^\/]+$/, '') + identifier.name + '.int'
    ;

    return new Chip(resolved);
  }
}
