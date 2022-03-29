import * as util from 'util';

import { Logger } from '@intent/utils';
import { Core } from '@intent/Core';
import { CoreEvent, ErrorEvent, StatEvent, StopEvent } from '@intent/kernel';
import { CoreConfig } from '@intent/CoreConfig';
import { TranspilerConfig } from '@intent/WatchedTranspilerPipeline';

import { ConfigProvider } from './ConfigProvider';
import { Module } from './modules';
import { ModuleNode } from './transpiler/ast';
import { TranspilerPipelineObserver } from './TranspilerPipelineObserver';

import configure from '../config';

export class AlchemyCore extends Core<TranspilerConfig, ModuleNode, Module> {
  public bootstrap(config: CoreConfig): TranspilerConfig {
    return super.bootstrap(
      config,
      (core, config) => (new ConfigProvider(config)).build(core),
      (core, resolved) => new TranspilerPipelineObserver(resolved),
    )
  }
}

export const factory = (configOverride?: Partial<TranspilerConfig>): Promise<CoreEvent> & { core: AlchemyCore } => {
  const core = new AlchemyCore();
  const config = core.bootstrap(<CoreConfig>{
    ...configure,
    // ... default config override here
    ...configOverride,
  });

  if (config.emit.config) {
    core.logger.log(Logger.INFO, util.inspect(config, { depth: null }));
    process.exit(0);
  }

  return Object.assign(<any>new Promise<CoreEvent|null>((rs, rj) => {
    core.and((event) => {
      const { type, data, parent } = event;

      switch (type) {
        case StatEvent.type():
          if (config.emit.stats) {
            core.logger.log(Logger.INFO, event, util.inspect(data.stat, {
              depth: null,
              colors: true,
              customInspect: true,
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
