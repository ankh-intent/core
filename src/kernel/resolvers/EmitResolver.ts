import { TreeNode } from '@intent/ast';
import { CoreConfig } from '../../CoreConfig';
import { Identifiable } from '../dependencies';

import { BaseEmitResolver } from './BaseEmitResolver';
import { CompoundEmitResolver } from './CompoundEmitResolver';
import { InternalEmitResolver } from './InternalEmitResolver';

export class EmitResolver<N extends TreeNode, T extends Identifiable<N>> extends CompoundEmitResolver<N, T> {
  public constructor(config: CoreConfig) {
    super([
      new InternalEmitResolver(config, '@lib'),
      new BaseEmitResolver(config),
    ]);
  }
}
