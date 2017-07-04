
import * as path from 'path';
import { CoreOptions } from '../../src/Core';

const root = __dirname.replace('/build/', '/').replace(/\/config$/, '');

const options: CoreOptions = {
  emit: {
    files: true,
    stats: false,
    options: false,
    extension: '.i.js',
  },
  files: [
    {
      event: '',
      pattern: /\\.int$/ig,
    }
  ],
  watch: {
    root: process.cwd(),
    aggregation: 200,
    ignore: /[\\/]\./,
  },
  server: {
    port: 3000,
    web: {
      root: path.resolve(path.join(root, '../src/intent-dispatch/resources/web/'))
    },
  },
  resolver: {
    paths: {
      intent: path.resolve(
        path.join(root, '../src/intent-core/intent/specification/lib/')
      ),
      project: process.cwd(),
      output: process.cwd(),
    }
  },
  interpreter: {
  },
};

export default options;
