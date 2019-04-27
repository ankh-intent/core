
import { PathsConfig } from '@intent/Core';

import { Chip } from '../Chip';
import { QualifierNode } from '../../transpiler/ast/QualifierNode';
import { QualifierResolverInterface } from './QualifierResolverInterface';
import { BaseQualifierResolver } from './BaseQualifierResolver';
import { IntentLibraryQualifierResolver } from './IntentLibraryQualifierResolver';

export class QualifierResolver implements QualifierResolverInterface {
  private config: PathsConfig;
  public resolvers: QualifierResolverInterface[];

  public constructor(config: PathsConfig) {
    this.config = config;
    this.resolvers = [
      new IntentLibraryQualifierResolver(config),
      new BaseQualifierResolver(config),
    ]
  }

  public resolve(from: Chip): QualifierNode {
    for (const resolver of this.resolvers) {
      const found = resolver.resolve(from);

      if (found) {
        return found;
      }
    }

    return null;
  }
}
