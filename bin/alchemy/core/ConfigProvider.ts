
import { WatchdogConfig } from '@intent/watchdog';
import { TranspilerConfig } from '@intent/WatchedTranspilerPipeline';
import { ConfigProvider as BaseConfigProvider, merge, regexpify } from '@intent/ConfigProvider';
import { Core } from '@intent/Core';

export class ConfigProvider extends BaseConfigProvider<TranspilerConfig> {
  protected options(defaults: Partial<TranspilerConfig>): any {
    return merge(super.options(defaults), {
      "Watchdog options": {
        "watch": {
          "type": "boolean",
          "alias": "w",
          "describe": "Watch for changes",
          "default": false,
          "requiresArg": false,
        },
        "watch-root": {
          "type": "string",
          "describe": "Set root directory to watch for changes",
          "default": defaults.watch!.root,
          "requiresArg": true,
        },
        "watch-ignore": {
          "type": "string",
          "describe": "Set pattern for files to ignore",
          "default": regexpify(defaults.watch!.ignore),
          "requiresArg": true,
        },
        "watch-aggregation": {
          "type": "number",
          "describe": "Set changes debounce time interval",
          "default": defaults.watch!.aggregation,
          "requiresArg": true,
        },
      },
    });
  }

  protected watch(): WatchdogConfig {
    return this.get("watch") && {
      root: this.get("watch-root"),
      ignore: new RegExp(this.get("watch-ignore").replace('\\', '\\\\')),
      aggregation: this.get("watch-aggregation"),
    };
  }

  public build(core: Core<TranspilerConfig, any, any>): TranspilerConfig {
    return {
      ...super.build(core),
      ...{
        watch: this.watch(),
      },
    };
  }
}
