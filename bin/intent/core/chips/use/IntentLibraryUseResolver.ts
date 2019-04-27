
import * as path from 'path';

import { PathsConfig } from '@intent/Core';
import { UseResolverInterface } from './UseResolverInterface';
import { Chip } from '../Chip';
import { QualifierNode } from '../../transpiler/ast/QualifierNode';

export class IntentLibraryUseResolver implements UseResolverInterface {
  private config: PathsConfig;

  public constructor(config: PathsConfig) {
    this.config = config;
  }

  public resolve(from: Chip, identifier: QualifierNode): Chip {
    if (identifier.name !== 'Intent') {
      return null;
    }

    const relative = identifier.path('/').toLowerCase().replace(/^intent[\/\\]/, '') + '.int';
    const resolved = path.join(this.config.internal, relative);

    return new Chip(resolved);
  }
}
