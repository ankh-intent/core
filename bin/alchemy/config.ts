import * as path from 'path';

import { TranspilerConfig } from '@intent/pipeline';

const cwd = process.cwd();
const project = __dirname.replace(/\/config$/, '');
const internal = path.resolve(path.join(project, '/core/lib/'));

const config: TranspilerConfig = {
    paths: {
        project,
        internal,
        internalName: 'Alchemy',
    },
    entry: {
        index: {
            path: path.resolve(
                path.join(project, '/example'),
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
        verbose: false,
    },
    watch: {
        root: cwd,
        aggregation: 200,
        ignore: /[\\/]\./,
    },
    output: {
        path: `${cwd}/build`,
        extension: '.a.ts',
    },
    interpreter: {},
};

export default config;
