#!/usr/bin/env -S cross-env TS_NODE_PROJECT=tsconfig.json node -r ts-node/register

import { resolve } from 'node:path';
import { register } from 'tsconfig-paths';
import { compilerOptions } from './tsconfig.json';

const baseUrl = resolve(compilerOptions.baseUrl);
const cleanup = register({
    baseUrl,
    paths: compilerOptions.paths,
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
