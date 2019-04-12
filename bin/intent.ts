#!/usr/bin/env node

if (process.env.ENV !== 'production') {
  require('source-map-support').install();
}

import * as util from 'util';
import configure from './config';
import { Logger } from '../src/core/utils/Logger';
import { Core } from '../src/core/Core';
import { StatEvent } from '~kernel/event/events/StatEvent';
import { Transpiler, TranspilerConfig } from './intent/Transpiler';

((core: Core<TranspilerConfig>) => {
  const transpiler = new Transpiler();
  const config = core.bootstrap({
      ...configure(process.env.ENV),
      ...{
        // ... default config override here
      },
    },
    transpiler,
  );

  if (config.emit.config) {
    console.log(util.inspect(config, {depth: null}));

//    process.exit(0);
  }

  core.and((event) => {
    const { type, data} = event;

    switch (type) {
      case StatEvent.type():
        if (config.emit.stats) {
          core.logger.log(Logger.INFO, event, util.inspect(data.stat, {
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

  return core.start(config);
})(new Core());
