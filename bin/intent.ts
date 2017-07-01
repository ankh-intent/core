#!/usr/bin/env node

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
        if (options.emitStats) {
          console.log('[INTENT/stat]: ', util.inspect(data, {
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
