#!/usr/bin/env ts-node

import * as path from 'path';
import * as tsConfigPaths from 'tsconfig-paths';

const tsConfig = require('./tsconfig.json');
const baseUrl = path.resolve(__dirname, tsConfig.compilerOptions.baseUrl);
const cleanup = tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths
});

(async () => {
  const { factory } = await import('./core');

  try {
    await factory();

    console.log('Done.');
  } catch (e) {
    console.error(e);

    process.exit(1);
  } finally {
    cleanup();
  }
})();
