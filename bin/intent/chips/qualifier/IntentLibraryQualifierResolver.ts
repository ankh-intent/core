
import { Chip } from '../Chip';
import { QualifierNode } from '../../transpiler/ast/QualifierNode';
import { BaseQualifierResolver } from './BaseQualifierResolver';

export class IntentLibraryQualifierResolver extends BaseQualifierResolver {
  public resolve(from: Chip): QualifierNode {
    const base = this.config.resolver.paths.intent;

    if (from.path.indexOf(base) < 0) {
      return null;
    }

    return new QualifierNode(
      "Intent",
      this.parse(base, from.path)
    );
  }
}
