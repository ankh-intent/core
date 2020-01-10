
import { PathsConfig } from '@intent/CoreConfig';

import { Chip } from '../Chip';
import { QualifierNode } from '../../transpiler/ast';
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

  public resolve(from: Chip): QualifierNode|null {
    for (const resolver of this.resolvers) {
      const found = resolver.resolve(from);

      if (found) {
        return found;
      }
    }

    return null;
  }
}
