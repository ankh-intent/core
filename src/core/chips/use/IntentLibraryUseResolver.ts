
import * as path from 'path';

import { UseResolverInterface } from './UseResolverInterface';
import { ResolverOptions } from '../ResolverOptions';
import { Chip } from '../Chip';
import { QualifierNode } from '../../intent/ast/QualifierNode';

export class IntentLibraryUseResolver implements UseResolverInterface {
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
