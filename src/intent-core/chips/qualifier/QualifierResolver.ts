
import { ResolverOptions } from '../ResolverOptions';
import { Chip } from '../Chip';
import { QualifierNode } from '../../../core/consumers/interpreting/intent/ast/QualifierNode';
import { QualifierResolverInterface } from './QualifierResolverInterface';
import { BaseQualifierResolver } from './BaseQualifierResolver';
import { IntentLibraryQualifierResolver } from './IntentLibraryQualifierResolver';

export class QualifierResolver implements QualifierResolverInterface {
  private options: ResolverOptions;
  public resolvers: QualifierResolverInterface[];

  public constructor(options: ResolverOptions) {
    this.options = options;
    this.resolvers = [
      new IntentLibraryQualifierResolver(options),
      new BaseQualifierResolver(options),
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
