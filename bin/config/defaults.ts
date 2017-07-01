
import * as path from 'path';
import { CoreOptions } from '../../src/Core';

const options: CoreOptions = {
  emitStats: false,
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
  resolver: {
    paths: {
      intent: path.resolve(
        path.join(__dirname.replace('/build/', '/'), 'core/intent/specification/lib/')
      ),
      project: process.cwd(),
      output: process.cwd(),
    }
  },
  interpreter: {
    emit: {
      extension: '.i.js',
    }
  },
};

export default options;
