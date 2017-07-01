#!/usr/bin/env node

if (process.env.ENV !== 'production') {
  require('source-map-support').install();
}

import config from './config';
import { CoreOptionsProvider } from '../src/CoreOptionsProvider';
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
      default:
        console.log(event, JSON.stringify(data));
    }
  });

  return core.start(options);
})(new Core());
