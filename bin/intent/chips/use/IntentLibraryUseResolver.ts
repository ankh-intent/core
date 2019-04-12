
import * as path from 'path';

import { UseResolverInterface } from './UseResolverInterface';
import { ResolverConfig } from '../ResolverConfig';
import { Chip } from '../Chip';
import { QualifierNode } from '../../transpiler/ast/QualifierNode';

export class IntentLibraryUseResolver implements UseResolverInterface {
  private config: ResolverConfig;

  public constructor(config: ResolverConfig) {
    this.config = config;
  }

  public resolve(from: Chip, identifier: QualifierNode): Chip {
    if (identifier.name !== 'Intent') {
      return null;
    }

    const relative = identifier.path('/').toLowerCase().replace(/^intent[\/\\]/, '') + '.int';
    const resolved = path.join(this.config.paths.intent, relative);

    return new Chip(resolved);
  }
}
