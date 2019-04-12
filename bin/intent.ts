#!/usr/bin/env node

if (process.env.ENV !== 'production') {
  require('source-map-support').install();
}

import * as util from 'util';
import configure from './config';
import { Logger } from '../src/intent-utils/Logger';
import { Transpiler, TranspilerConfig } from '../src/intent/Transpiler';
import { StatEvent } from '../src/core/kernel/event/events/StatEvent';
import { Core } from '../src/Core';

((core: Core<CompilerConfig>) => {
  const compiler = new Compiler();
  const config = core.bootstrap({
      ...configure(process.env.ENV),
      ...{
        // ... default config override here
      },
    },
    compiler,
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
