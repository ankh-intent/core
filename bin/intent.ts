#!/usr/bin/env node

import config from './config';
import { Core } from '../src/Core';

((core: Core) => {
  let options = core.bootstrap({...config(core), ...{
    watch: {
      aggregation: 0,
    },
  }});

  core.and((event) => {
    let { type, data} = event;

    switch (type) {
      default:
      console.log(`[INTENT/UNCAUGHT/${type}]:`, JSON.stringify(data));
    }
  });

  return core;
})(new Core()).start();
