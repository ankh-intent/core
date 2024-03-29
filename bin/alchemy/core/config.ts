import { join, resolve } from 'path';

import { LogLevel, Logger } from '@intent/kernel';
import { TranspilerConfig } from '@intent/pipeline';

const cwd = process.cwd();
const project = resolve(__dirname.replace(/\/config$/, ''), '..');
const internal = resolve(join(project, 'core', 'lib'));

const config: TranspilerConfig = {
    paths: {
        project,
        internal,
        internalName: 'Alchemy',
    },
    entry: {
        index: {
            path: resolve(
                join(project, 'example'),
            ),
            test: [
                { pattern: '.alc' },
            ],
        },
    },
    emit: {
        files: false,
        stats: false,
        config: false,
        verbosity: Logger.inverse(LogLevel.NORMAL),
    },
    watch: {
        root: cwd,
        aggregation: 200,
        ignore: /[\\/]\./,
    },
    output: {
        path: join(cwd, 'build'),
        extension: '.a.ts',
    },
    interpreter: {},
};

export default config;
