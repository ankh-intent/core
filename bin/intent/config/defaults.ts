
import * as path from 'path';
import { TranspilerConfig } from '../core/TranspilerPipelineObserver';

const root = __dirname.replace(/\/config$/, '');
const project = process.cwd();

const config: TranspilerConfig = {
  paths: {
    project,
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
  resolver: {
    paths: {
      intent: path.resolve(
        path.join(root, '/core/lib/')
      ),
    }
  },
  interpreter: {
  },
};

export default config;
