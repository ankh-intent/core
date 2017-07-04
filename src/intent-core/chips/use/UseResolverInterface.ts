
import path = require('path');

import { Chip } from '../Chip';
import { QualifierNode } from '../../intent/ast/QualifierNode';

export interface UseResolverInterface {

  resolve(from: Chip, identifier: QualifierNode): Chip;

}
