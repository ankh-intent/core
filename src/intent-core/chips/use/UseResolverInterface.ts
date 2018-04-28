
import { Chip } from '../Chip';
import { QualifierNode } from '../../../core/consumers/transpiling/intent/ast/QualifierNode';

export interface UseResolverInterface {

  resolve(from: Chip, identifier: QualifierNode): Chip;

}
