#!/usr/bin/env -S pnpm cross-env NODE_NO_WARNINGS=1 TS_NODE_PROJECT=tsconfig.json node --inspect -r ts-node/register

import './alchemy';
