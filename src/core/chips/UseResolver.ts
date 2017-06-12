
import { Chip } from './Chip';
import { QualifierNode } from '../intent/ast/QualifierNode';

export interface UseResolver {

  resolve(from: Chip, identifier: QualifierNode): Chip;

}

export class BaseUseResolver implements UseResolver {
  public resolvers: UseResolver[] = [
    new IntentUseResolver(),
  ];

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

    return new Chip(
      from.path.replace(/\/[^\/]+$/, '') + identifier.name + '.int'
    );
  }

}

export class IntentUseResolver implements UseResolver {
  public resolve(from: Chip, identifier: QualifierNode): Chip {
    if (identifier.name !== 'Intent') {
      return null;
    }

    return new Chip(
      `~/dev/js/intent/intent-core/src/core/intent/specification/${identifier.path('/').toLowerCase().replace(/^intent\//, 'lib/')}.int`
    );
  }
}
