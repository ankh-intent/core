import { PathsConfig } from '@intent/CoreConfig';
import { Strings } from '@intent/utils';

import { UseResolverInterface } from './UseResolverInterface';
import { LibraryUseResolver } from './LibraryUseResolver';
import { Chip } from '../Chip';
import { QualifierNode } from '../../transpiler/ast';

export class BaseUseResolver implements UseResolverInterface {
  private config: PathsConfig;
  public resolvers: UseResolverInterface[];

  public constructor(config: PathsConfig) {
    this.config = config;
    this.resolvers = [
      new LibraryUseResolver(config),
    ]
  }

  supports(from: Chip, identifier: QualifierNode) {
    return true;
  }

  public resolve(from: Chip, identifier: QualifierNode): Chip {
    for (const resolver of this.resolvers) {
      if (resolver.supports(from, identifier)) {
        const found = resolver.resolve(from, identifier);

        if (found) {
          return found;
        }
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

    const common = Strings.longestCommon([this.config.project, from.identifier]).pop();
    const resolved = from.identifier
        .replace(new RegExp(`^${common}`), '')
        .replace(/\/[^\/]+$/, '') + identifier.name + '.int'
    ;

    return new Chip(resolved);
  }
}
