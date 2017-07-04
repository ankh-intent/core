
import { Chip } from '../Chip';
import { QualifierNode } from '../../intent/ast/QualifierNode';

export interface QualifierResolverInterface {

  resolve(from: Chip): QualifierNode;

}
