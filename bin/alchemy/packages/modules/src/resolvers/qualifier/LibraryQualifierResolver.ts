import { QualifierNode } from '@alchemy/ast';
import { BaseQualifierResolver } from './BaseQualifierResolver';

export class LibraryQualifierResolver extends BaseQualifierResolver {
    public resolve(uri: string): QualifierNode | null {
        const base = this.config.internal;

        if (uri.indexOf(base) < 0) {
            return null;
        }

        return new QualifierNode(
            this.config.internalName,
            this.parse(base, uri),
        );
    }
}
