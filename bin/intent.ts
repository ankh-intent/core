#!/usr/bin/env node

if (process.env.ENV !== 'production') {
  require('source-map-support').install();
}

import * as util from 'util';
import configure from './config';
import { Logger } from '../src/intent-utils/Logger';
import { CoreConfigProvider } from '../src/CoreConfigProvider';
import { StatEvent } from '../src/core/kernel/event/events/StatEvent';
import { Core } from '../src/Core';

((core: Core) => {
  let provider = new CoreConfigProvider(
    configure(process.env.ENV)
  );
  let config = core.bootstrap(
    {
      ...provider.build(core),
      ...{
        // ... default config override here
      },
    }
  );

  if (config.emit.config) {
    core.logger.log(Logger.INFO, util.inspect(config, {depth: null}));

    process.exit(0);
  }

  core.and((event) => {
    let { type, data} = event;

    switch (type) {
      case StatEvent.type():
        if (config.emit.stats) {
          core.logger.log(Logger.INFO, event, JSON.stringify(util.inspect(data.stat, {
            depth: null,
          })));
        }
        break;

      default:
        // console.log({
        //   type: event.type,
        // });
    }
  });

  return core.start(config);
})(new Core());
