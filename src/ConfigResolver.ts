
import path = require('path');
import { CoreConfig } from './Core';

export class ConfigResolver {
  public resolve(config: CoreConfig): CoreConfig {
    let resolved = Object.assign({}, config);

    if (!resolved.resolver.paths.intent) {
      resolved.resolver.paths.intent = path.resolve(
        path.join(__dirname.replace(/[\\/]build[\\/]/, '/'), 'intent-core/intent/specification/lib/')
      );
    }

    if (!resolved.resolver.paths.output) {
      resolved.resolver.paths.output = resolved.resolver.paths.project;
    }

    return resolved;
  }
}
