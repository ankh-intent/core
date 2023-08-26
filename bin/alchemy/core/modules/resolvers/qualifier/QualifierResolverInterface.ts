import { QualifierNode } from '../../../transpiler';

export interface QualifierResolverInterface {
    resolve(uri: string): QualifierNode | null;
}
