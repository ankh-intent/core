
import { Chip } from '../Chip';
import { QualifierNode } from '../../../core/consumers/interpreting/intent/ast/QualifierNode';

export interface UseResolverInterface {

  resolve(from: Chip, identifier: QualifierNode): Chip;

}
