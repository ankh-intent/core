
import * as path from 'path';
import { TranspilerConfig } from '../core/TranspilerPipelineObserver';

const root = __dirname.replace(/\/config$/, '');

const config: TranspilerConfig = {
  paths: {
    project: process.cwd(),
  },
  entry: {
    index: {
      path: process.cwd() + '/bin/example',
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
    root: process.cwd(),
    aggregation: 200,
    ignore: /[\\/]\./,
  },
  output: {
    path: process.cwd(),
    extension: '.i.ts',
  },
  resolver: {
    paths: {
      intent: path.resolve(
        path.join(root, 'intent/lib/')
      ),
    }
  },
  interpreter: {
  },
};

export default config;
