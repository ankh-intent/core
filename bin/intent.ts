#!/usr/bin/env node

if (process.env.ENV !== 'production') {
  require('source-map-support').install();
}

import * as util from 'util';
import config from './config';
import { Logger } from '../src/intent-utils/Logger';
import { CoreOptionsProvider } from '../src/CoreOptionsProvider';
import { StatEvent } from '../src/intent-core/flow/events/StatEvent';
import { Core } from '../src/Core';

((core: Core) => {
  let provider = new CoreOptionsProvider(
    config(process.env.ENV)
  );
  let options = core.bootstrap(
    {
      ...provider.build(core),
      ...{
        // ... default options override here
      },
    }
  );

  if (options.emit.options) {
    core.logger.log(Logger.INFO, util.inspect(options, {depth: null}));

    process.exit(0);
  }

  core.and((event) => {
    let { type, data} = event;

    switch (type) {
      case StatEvent.type():
        if (options.emit.stats) {
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

  return core.start(options);
})(new Core());
