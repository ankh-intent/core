#!/usr/bin/env node

import { Logger } from '../src/intent-utils/Logger';
if (process.env.ENV !== 'production') {
  require('source-map-support').install();
}

import * as util from 'util';
import config from './config';
import { CoreOptionsProvider } from '../src/CoreOptionsProvider';
import { StatEvent } from '../src/core/flow/events/StatEvent';
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

  core.and((event) => {
    let { type, data} = event;

    switch (type) {
      case StatEvent.type():
        if (options.emit.stats) {
          core.logger.log(Logger.INFO, event, util.inspect(data, {
            depth: null,
          }));
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
