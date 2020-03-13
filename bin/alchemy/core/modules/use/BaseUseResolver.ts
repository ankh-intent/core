import { PathsConfig } from '@intent/CoreConfig';
import { Strings } from '@intent/utils';

import { UseResolverInterface } from './UseResolverInterface';
import { LibraryUseResolver } from './LibraryUseResolver';
import { Module } from '../Module';
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

  supports(from: Module, identifier: QualifierNode) {
    return true;
  }

  public resolve(from: Module, identifier: QualifierNode): Module {
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
      if (search === found.uri) {
        return identifier.child
          ? this.resolve(found, identifier.child)
          : found;
      }
    }

    const common = Strings.longestCommon([this.config.project, from.uri]).pop();
    const resolved = from.uri
        .replace(new RegExp(`^${common}`), '')
        .replace(/\/[^\/]+$/, '/') + search.toLowerCase() + '.alc'
    ;

    return new Module(common + resolved);
  }
}
