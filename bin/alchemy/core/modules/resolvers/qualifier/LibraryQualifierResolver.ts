import { QualifierNode } from '../../../transpiler/ast';
import { BaseQualifierResolver } from './BaseQualifierResolver';

export class LibraryQualifierResolver extends BaseQualifierResolver {
  public resolve(uri: string): QualifierNode|null {
    const base = this.config.internal;

    if (uri.indexOf(base) < 0) {
      return null;
    }

    return new QualifierNode(
      'Alchemy',
      this.parse(base, uri)
    );
  }
}
