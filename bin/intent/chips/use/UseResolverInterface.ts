
import { Chip } from '../Chip';
import { QualifierNode } from '../../transpiler/ast/QualifierNode';

export interface UseResolverInterface {
  resolve(from: Chip, identifier: QualifierNode): Chip;
}
