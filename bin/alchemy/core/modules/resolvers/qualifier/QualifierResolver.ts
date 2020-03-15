import { PathsConfig } from '@intent/CoreConfig';

import { Module } from '../../Module';
import { QualifierNode } from '../../../transpiler/ast';
import { QualifierResolverInterface } from './QualifierResolverInterface';
import { BaseQualifierResolver } from './BaseQualifierResolver';
import { LibraryQualifierResolver } from './LibraryQualifierResolver';

export class QualifierResolver implements QualifierResolverInterface {
  private config: PathsConfig;
  public resolvers: QualifierResolverInterface[];

  public constructor(config: PathsConfig) {
    this.config = config;
    this.resolvers = [
      new LibraryQualifierResolver(config),
      new BaseQualifierResolver(config),
    ]
  }

  public resolve(from: Module): QualifierNode|null {
    for (const resolver of this.resolvers) {
      const found = resolver.resolve(from);

      if (found) {
        return found;
      }
    }

    return null;
  }
}
