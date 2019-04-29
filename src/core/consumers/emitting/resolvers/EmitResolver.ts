import { CoreConfig } from '../../../CoreConfig';
import { TreeNode } from '../../../kernel/ast/TreeNode';
import { Identifiable } from '../../../kernel/dependencies/DependencyNode';

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
