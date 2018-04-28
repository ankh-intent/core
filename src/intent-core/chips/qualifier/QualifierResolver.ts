
import { ResolverConfig } from '../ResolverConfig';
import { Chip } from '../Chip';
import { QualifierNode } from '../../../core/consumers/interpreting/intent/ast/QualifierNode';
import { QualifierResolverInterface } from './QualifierResolverInterface';
import { BaseQualifierResolver } from './BaseQualifierResolver';
import { IntentLibraryQualifierResolver } from './IntentLibraryQualifierResolver';

export class QualifierResolver implements QualifierResolverInterface {
  private config: ResolverConfig;
  public resolvers: QualifierResolverInterface[];

  public constructor(config: ResolverConfig) {
    this.config = config;
    this.resolvers = [
      new IntentLibraryQualifierResolver(config),
      new BaseQualifierResolver(config),
    ]
  }

  public resolve(from: Chip): QualifierNode {
    let found;

    for (let resolver of this.resolvers) {
      if (found = resolver.resolve(from)) {
        return found;
      }
    }

    return null;
  }
}
