import { Chip } from '../Chip';
import { QualifierNode } from '../../transpiler/ast';
import { BaseQualifierResolver } from './BaseQualifierResolver';

export class LibraryQualifierResolver extends BaseQualifierResolver {
  public resolve(from: Chip): QualifierNode|null {
    const base = this.config.internal;

    if (from.identifier.indexOf(base) < 0) {
      return null;
    }

    return new QualifierNode(
      'Intent',
      this.parse(base, from.identifier)
    );
  }
}
