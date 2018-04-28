
import { UseResolverInterface } from './UseResolverInterface';
import { ResolverConfig } from '../ResolverConfig';
import { IntentLibraryUseResolver } from './IntentLibraryUseResolver';
import { Chip } from '../Chip';
import { QualifierNode } from '../../../core/consumers/interpreting/intent/ast/QualifierNode';
import { Strings } from '../../../intent-utils/Strings';

export class BaseUseResolver implements UseResolverInterface {
  private config: ResolverConfig;
  public resolvers: UseResolverInterface[];

  public constructor(config: ResolverConfig) {
    this.config = config;
    this.resolvers = [
      new IntentLibraryUseResolver(config),
    ]
  }

  public resolve(from: Chip, identifier: QualifierNode): Chip {
    let found;

    for (let resolver of this.resolvers) {
      if (found = resolver.resolve(from, identifier)) {
        return found;
      }
    }

    let search = identifier.name;

    for (let found of Object.keys(from.linked).map((name) => from.linked[name])) {
      if (search === found.name) {
        return identifier.child
          ? this.resolve(found, identifier.child)
          : found;
      }
    }

    let common = Strings.longestCommon([this.config.paths.project, from.path]).pop();
    let resolved = from.path
        .replace(new RegExp(`^${common}`), '')
        .replace(/\/[^\/]+$/, '') + identifier.name + '.int'
    ;

    return new Chip(resolved);
  }
}
