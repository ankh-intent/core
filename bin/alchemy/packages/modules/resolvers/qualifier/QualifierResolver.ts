import { PathsConfig } from '@intent/config';

import { QualifierNode } from '@alchemy/ast';
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
        ];
    }

    public resolve(uri: string): QualifierNode | null {
        for (const resolver of this.resolvers) {
            const found = resolver.resolve(uri);

            if (found) {
                return found;
            }
        }

        return null;
    }
}
