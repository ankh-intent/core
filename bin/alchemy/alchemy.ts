#!/usr/bin/env ts-node --project tsconfig.json

import * as path from 'path';
import { register } from 'tsconfig-paths';
import { compilerOptions } from './tsconfig.json';

console.log(compilerOptions.baseUrl);
const baseUrl = path.resolve(compilerOptions.baseUrl);
const cleanup = register({
  baseUrl,
  paths: compilerOptions.paths
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
    // cleanup();
  }
})();
