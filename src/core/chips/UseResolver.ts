
import path = require('path');
import { Chip } from './Chip';
import { QualifierNode } from '../intent/ast/QualifierNode';
import { Strings } from '../../intent-utils/Strings';

export interface UseResolver {

  resolve(from: Chip, identifier: QualifierNode): Chip;

}

export interface ResolverOptions {
  paths: {
    project: string;
    intent?: string;
  };
}

export class BaseUseResolver implements UseResolver {
  private options: ResolverOptions;
  public resolvers: UseResolver[];

  public constructor(options: ResolverOptions) {
    this.options = options;
    this.resolvers = [
      new IntentUseResolver(options),
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

    let common = Strings.longestCommon([this.options.paths.project, from.path]).pop();
    let resolved = from.path
      .replace(new RegExp(`^${common}`), '')
      .replace(/\/[^\/]+$/, '') + identifier.name + '.int'
    ;

    return new Chip(resolved);
  }
}

export class IntentUseResolver implements UseResolver {
  private options: ResolverOptions;

  public constructor(options: ResolverOptions) {
    this.options = options;
  }

  public resolve(from: Chip, identifier: QualifierNode): Chip {
    if (identifier.name !== 'Intent') {
      return null;
    }

    let relative = identifier.path('/').toLowerCase().replace(/^intent\//, '') + '.int';
    let resolved = path.join(this.options.paths.intent, relative);

    return new Chip(resolved);
  }
}
