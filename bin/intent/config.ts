import * as path from 'path';

import { TranspilerConfig } from '@intent/WatchedTranspilerPipeline';

const cwd = process.cwd();
const project = __dirname.replace(/\/config$/, '');
const internal = path.resolve(path.join(project, '/core/lib/'));

const config: TranspilerConfig = {
  paths: {
    project,
    internal,
  },
  entry: {
    index: {
      path: path.resolve(
        path.join(project, '/example')
      ),
      test: [
        { pattern: '.int' },
      ],
    },
  },
  emit: {
    files: true,
    stats: false,
    config: false,
  },
  watch: {
    root: cwd,
    aggregation: 200,
    ignore: /[\\/]\./,
  },
  output: {
    path: `${cwd}/build`,
    extension: '.i.ts',
  },
  interpreter: {
  },
};

export default config;
