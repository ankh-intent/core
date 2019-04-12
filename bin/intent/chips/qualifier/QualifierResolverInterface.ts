
import { Chip } from '../Chip';
import { QualifierNode } from '../../transpiler/ast/QualifierNode';

export interface QualifierResolverInterface {
  resolve(from: Chip): QualifierNode;
}
