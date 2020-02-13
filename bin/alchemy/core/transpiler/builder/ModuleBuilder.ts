import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../Alchemy';
import { DomainNode, ModuleNode, UsesNode } from '../ast';
import { BaseBuilder } from './BaseBuilder';

export interface ModuleChildren extends AlchemyBuildInvokers {
  domain: BuildInvoker<DomainNode>;
  uses: BuildInvoker<UsesNode>;
}

export class ModuleBuilder extends BaseBuilder<ModuleNode, ModuleChildren> {
  protected build(tokens, { not, get, ensure }: TypedTokenMatcherInterface) {
    const uses = this.child.uses(tokens);
    const domain = this.child.domain(tokens);

    return new ModuleNode(
      uses,
      domain,
    );
  }
}
