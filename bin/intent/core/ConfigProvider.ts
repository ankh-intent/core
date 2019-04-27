import * as path from 'path';

import { Core } from '@intent/Core';
import { InterpreterConfig } from '@intent/consumers/interpreting/DependencyModifiedConsumer';

import { ConfigProvider as BaseConfigProvider, merge } from '../../../src/core/ConfigProvider';
import { TranspilerConfig, OutputConfig } from './TranspilerPipelineObserver';

export class ConfigProvider extends BaseConfigProvider<TranspilerConfig> {
  protected options(defaults: Partial<TranspilerConfig>): any {
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

  protected interpreter(): InterpreterConfig {
    return {
    };
  }

  public build(core: Core<TranspilerConfig, any, any>): TranspilerConfig {
    return {
      ...super.build(core),
      ...{
        output: this.output(),
        interpreter: this.interpreter(),
      },
    };
  }
}
