
import { Chip } from '../Chip';
import { QualifierNode } from '../../../core/consumers/interpreting/intent/ast/QualifierNode';
import { BaseQualifierResolver } from './BaseQualifierResolver';

export class IntentLibraryQualifierResolver extends BaseQualifierResolver {
  public resolve(from: Chip): QualifierNode {
    let base = this.options.paths.intent;

    if (from.path.indexOf(base) < 0) {
      return null;
    }

    return new QualifierNode(
      "Intent",
      this.parse(base, from.path)
    );
  }
}
