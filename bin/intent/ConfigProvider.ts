import * as path from 'path';

import { Core } from '@intent/Core';
import { InterpreterConfig } from '@intent/consumers/interpreting/DependencyModifiedConsumer';

import { ConfigProvider as BaseConfigProvider, merge } from '../../src/core/ConfigProvider';
import { TranspilerConfig, OutputConfig } from './Transpiler';
import { ResolverConfig } from './chips/ResolverConfig';

export class ConfigProvider extends BaseConfigProvider<TranspilerConfig> {
  protected options(defaults: TranspilerConfig): any {
    return merge(super.options(defaults), {
      "Emit options": {
        "output-dir": {
          "type": "string",
          "alias": "o",
          "describe": "Directory to output emitted files to",
          "default": defaults.output.path,
          "requiresArg": true,
        },
        "output-extension": {
          "type": "string",
          "describe": "Extension to emit files with",
          "default": defaults.output.extension,
          "requiresArg": true,
        },
      },
    });
  }

  private output(): OutputConfig {
    return <OutputConfig> {
      extension: this.get("output-extension"),
      path: path.resolve(this.get("output-dir")),
    };
  }

  protected resolver(defaults: TranspilerConfig): ResolverConfig {
    return {
      paths: {
        intent: defaults.resolver.paths.intent || path.resolve(
          path.join(__dirname.replace(/[\\/]build[\\/]/, '/'), 'core/consumers/interpreting/intent/specification/lib/')
        ),
      },
    };
  }

  protected interpreter(): InterpreterConfig {
    return {
    };
  }

  public build(core: Core<TranspilerConfig>): TranspilerConfig {
    const defaults = this.defaults();

    return {
      ...super.build(core),
      ...{
        output: this.output(),
        resolver: this.resolver(defaults),
        interpreter: this.interpreter(),
      },
    };
  }
}
