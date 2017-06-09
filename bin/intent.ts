#!/usr/bin/env node

import { Core, CoreOptions } from '../src/index';

(new Core()).bootstrap(<CoreOptions>{
  files: [
    {
      pattern: /.intent$/ig,
    }
  ],
  watch: {
    debounce: 500,
  },
});
