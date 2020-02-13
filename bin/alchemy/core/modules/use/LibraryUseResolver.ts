import { PathsConfig } from '@intent/CoreConfig';
import * as path from 'path';

import { UseResolverInterface } from './UseResolverInterface';
import { Module } from '../Module';
import { QualifierNode } from '../../transpiler/ast';

export class LibraryUseResolver implements UseResolverInterface {
  private config: PathsConfig;

  public constructor(config: PathsConfig) {
    this.config = config;
  }

  supports(from: Module, identifier: QualifierNode): boolean {
    return identifier.name === 'Alchemy';
  }

  public resolve(from: Module, identifier: QualifierNode): Module {
    const relative = identifier.path('/').toLowerCase().replace(/^alchemy[\/\\]/, '') + '.alc';
    const resolved = path.join(this.config.internal, relative);

    return new Module(resolved);
  }
}
