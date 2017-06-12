
import path = require('path');
import { CoreOptions } from './Core';

export class OptionsResolver {
  public resolve(options: CoreOptions): CoreOptions {
    let resolved = Object.assign({}, options);

    if (!resolved.resolver.paths.intent) {
      resolved.resolver.paths.intent = path.resolve(
        path.join(__dirname.replace('/build/', '/'), 'core/intent/specification/lib/')
      );
    }

    return resolved;
  }
}
