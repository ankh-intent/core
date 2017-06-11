#!/usr/bin/env node

import { Core, CoreOptions } from '../src/Core';

(new Core()).bootstrap(<CoreOptions>{
  files: [
    {
      event: 'change',
      pattern: /\.int$/ig,
    }
  ],
  watch: {
    aggregation: 400,
  },
});

