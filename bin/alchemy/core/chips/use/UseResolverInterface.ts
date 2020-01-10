
import { Chip } from '../Chip';
import { QualifierNode } from '../../transpiler/ast/QualifierNode';

export interface UseResolverInterface {
  supports(from: Chip, identifier: QualifierNode): boolean;
  resolve(from: Chip, identifier: QualifierNode): Chip;
}
