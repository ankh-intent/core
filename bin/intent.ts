#!/usr/bin/env node

import path = require('path');
import { Core } from '../src/Core';

(new Core()).bootstrap({
  files: [
    {
      event: 'change',
      pattern: /\.int$/ig,
    }
  ],
  resolver: {
    paths: {
      project: __dirname,
    },
  },
  watch: {
    aggregation: 400,
  },
}).and((event) => {
  let { type, data} = event;

  switch (type) {
    default:
      console.log(`[INTENT/UNCAUGHT/${type}]:`, JSON.stringify(data));
  }
});
