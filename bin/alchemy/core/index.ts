import * as util from 'util';

import { Logger } from '@intent/utils/Logger';
import { Core} from '@intent/Core';
import { CoreEvent } from '@intent/kernel/event/CoreEvent';
import { ErrorEvent } from '@intent/kernel/event/events/ErrorEvent';
import { StatEvent } from '@intent/kernel/event/events/StatEvent';
import { StopEvent } from '@intent/kernel/event/events/StopEvent';
import { CoreConfig } from '@intent/CoreConfig';
import { TranspilerConfig } from '@intent/WatchedTranspilerPipeline';

import { ConfigProvider } from './ConfigProvider';
import { Chip } from './chips/Chip';
import { ChipNode } from './transpiler/ast/ChipNode';
import { TranspilerPipelineObserver } from './TranspilerPipelineObserver';

import configure from '../config';

export class AlchemyCore extends Core<TranspilerConfig, ChipNode, Chip> {
  public bootstrap(config: CoreConfig): TranspilerConfig {
    return super.bootstrap(
      config,
      (core, config) => (new ConfigProvider(config)).build(core),
      (core, resolved) => new TranspilerPipelineObserver(resolved),
    )
  }
}

export const factory = (configOverride?: Partial<TranspilerConfig>): Promise<CoreEvent<any>> & { core: AlchemyCore } => {
  const core = new AlchemyCore();
  const config = core.bootstrap({
    ...configure,
    // ... default config override here
    ...configOverride,
  });

  if (config.emit.config) {
    console.log(util.inspect(config, {depth: null}));

//    process.exit(0);
  }

  return Object.assign(<any>new Promise((rs, rj) => {
    core.and((event) => {
      const { type, data, parent } = event;

      switch (type) {
        case StatEvent.type():
          if (config.emit.stats) {
            core.logger.log(Logger.INFO, event, util.inspect(data.stat, {
              depth: null,
            }));
          }
          break;

        case StopEvent.type(): {
          if (parent instanceof ErrorEvent) {
            rj(parent);
          } else {
            rs(parent);
          }

          break;
        }

        default:
        // console.log({
        //   type: event.type,
        // });
      }
    });

    core.start(config);
  }), {
    core,
  });
};
