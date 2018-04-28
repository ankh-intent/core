
import { Chip } from '../Chip';
import { QualifierNode } from '../../../core/consumers/interpreting/intent/ast/QualifierNode';

export interface QualifierResolverInterface {

  resolve(from: Chip): QualifierNode;

}
