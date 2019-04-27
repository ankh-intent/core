#!/usr/bin/env ts-node

if (process.env.ENV !== 'production') {
  require('source-map-support').install();
}

import * as path from 'path';
import * as tsConfig from './tsconfig.json';
import * as tsConfigPaths from 'tsconfig-paths';

const baseUrl = path.resolve(tsConfig.compilerOptions.baseUrl);
const cleanup = tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths
});

(async () => {
  const { factory } = await import('./core');
  const { handle } = factory();

  try {
    console.log('Pre...');
    await handle;

    console.log('Done.');
  } catch (e) {
    console.error(e);

    process.exit(1);
  } finally {
    console.log('Ooopsie...');
    cleanup();
  }
})();
