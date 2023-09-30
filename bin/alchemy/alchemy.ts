#!/usr/bin/env -S pnpm cross-env NODE_NO_WARNINGS=1 TS_NODE_PROJECT=tsconfig.json node -r ts-node/register

import { factory }  from './core';

(async () => {
    try {
        await factory();

        console.log('Done.');
    } catch (e) {
        console.error(e);

        process.exit(1);
    }
})();
