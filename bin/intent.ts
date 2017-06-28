#!/usr/bin/env node

if (process.env.ENV !== 'production') {
  require('source-map-support').install();
}

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
        console.log(event, JSON.stringify(data));
    }
  });

  return core.start(options);
})(new Core());
