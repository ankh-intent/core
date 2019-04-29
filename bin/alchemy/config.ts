
import * as path from 'path';

import { TranspilerConfig } from '@intent/WatchedTranspilerPipeline';

const root = __dirname.replace(/\/config$/, '');
const project = process.cwd();
const internal = path.resolve(path.join(root, '/core/lib/'));

const config: TranspilerConfig = {
  paths: {
    project,
    internal,
  },
  entry: {
    index: {
      path: path.resolve(
        path.join(root, '/example')
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
    root: project,
    aggregation: 200,
    ignore: /[\\/]\./,
  },
  output: {
    path: project,
    extension: '.i.ts',
  },
  interpreter: {
  },
};

export default config;
