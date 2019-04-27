import { Core, CoreConfig } from '@intent/Core';

import { Chip } from './chips/Chip';
import { ConfigProvider } from './ConfigProvider';
import { ChipNode } from './transpiler/ast/ChipNode';
import { TranspilerConfig, TranspilerPipelineObserver } from './TranspilerPipelineObserver';

export class IntentCore extends Core<TranspilerConfig, ChipNode, Chip> {
  public bootstrap(config: CoreConfig): TranspilerConfig {
    return super.bootstrap(
      config,
      (core, config) => (new ConfigProvider(config)).build(core),
      (core, resolved) => new TranspilerPipelineObserver(resolved),
    )
  }
}
