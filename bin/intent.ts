#!/usr/bin/env node

import config from './config';
import { Core } from '../src/Core';
import { StatEvent } from '../src/core/flow/events/StatEvent';

((core: Core) => {
  let logger = {
    log: (event, ...args) => {
      console.log(`[INTENT/${event.type}]:`, ...args);
    },
    warn: (event, ...args) => {
      console.warn(`[INTENT/WARN/${event.type}]:`, ...args);
    },
    error: (event, ...args) => {
      console.error(`[INTENT/UNCAUGHT/${event.type}]:`, ...args);
    },
  };

  let options = core.bootstrap({...config(core), ...{
    watch: {
      aggregation: 0,
    },
  }});

  core.and((event) => {
    let { type, data} = event;

    switch (type) {
      case StatEvent.type():
        if (data.stat === 'ready') {
          if (options.watch) {
            logger.log(event, 'Watching...');
          }
        }
        break;

      default:
        logger.log(event, JSON.stringify(data));
    }
  });

  return core;
})(new Core()).start();
