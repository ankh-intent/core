import { QualifierNode } from '@alchemy/ast';

export interface QualifierResolverInterface {
    resolve(uri: string): QualifierNode | null;
}
