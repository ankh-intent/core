
import { Core, CoreOptions } from '../src/Core';

export default (core: Core) => {
  return <CoreOptions>{
    files: [
      {
        event: 'change',
        pattern: /\.int$/ig,
      }
    ],
    resolver: {
      paths: {
        project: __dirname.replace('/build/', '/'),
      },
    },
  };
};
