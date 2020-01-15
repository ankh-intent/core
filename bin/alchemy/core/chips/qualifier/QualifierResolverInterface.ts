import { Chip } from '../Chip';
import { QualifierNode } from '../../transpiler/ast';

export interface QualifierResolverInterface {
  resolve(from: Chip): QualifierNode|null;
}
