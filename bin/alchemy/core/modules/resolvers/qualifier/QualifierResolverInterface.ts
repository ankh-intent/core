import { QualifierNode } from '../../../transpiler/ast';

export interface QualifierResolverInterface {
    resolve(uri: string): QualifierNode | null;
}
