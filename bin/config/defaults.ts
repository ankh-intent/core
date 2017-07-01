
import * as path from 'path';
import { CoreOptions } from '../../src/Core';

const options: CoreOptions = {
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
      project: null,
      output: null,
    }
  },
  interpreter: {
    emit: {
      extension: '.i.js',
    }
  },
};

export default options;
