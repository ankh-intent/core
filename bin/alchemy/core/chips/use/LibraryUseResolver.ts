
import { PathsConfig } from '@intent/CoreConfig';
import * as path from 'path';

import { UseResolverInterface } from './UseResolverInterface';
import { Chip } from '../Chip';
import { QualifierNode } from '../../transpiler/ast/QualifierNode';

export class LibraryUseResolver implements UseResolverInterface {
  private config: PathsConfig;

  public constructor(config: PathsConfig) {
    this.config = config;
  }

  supports(from: Chip, identifier: QualifierNode): boolean {
    return identifier.name === 'Intent';
  }

  public resolve(from: Chip, identifier: QualifierNode): Chip {
    const relative = identifier.path('/').toLowerCase().replace(/^intent[\/\\]/, '') + '.int';
    const resolved = path.join(this.config.internal, relative);

    return new Chip(resolved);
  }
}
