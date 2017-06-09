#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
(new index_1.Core()).bootstrap({
    files: [
        {
            pattern: /.intent$/ig,
        }
    ],
    watch: {
        debounce: 500,
    },
});
//# sourceMappingURL=intent.js.map