
import * as path from 'path';
import { CompilerConfig } from '../../src/intent/Compiler';

const root = __dirname.replace('/build/', '/').replace(/\/config$/, '');

const config: CompilerConfig = {
  paths: {
    project: process.cwd(),
  },
  entry: {
    index: {
      path: process.cwd() + '/doc',
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
    extension: '.i.js',
  },
  resolver: {
    paths: {
      intent: path.resolve(
        path.join(root, '../src/intent-core/intent/specification/lib/')
      ),
    }
  },
  interpreter: {
  },
};

export default config;
