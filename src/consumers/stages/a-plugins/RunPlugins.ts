import { PluginRegistry } from '@intent/plugins';

import { AbstractConsumer, CoreEvent, CoreEventBus, ErrorEvent } from '../../../kernel';

export class RunPlugins<E extends CoreEvent = CoreEvent> extends AbstractConsumer<E, any>{
  private readonly plugins: PluginRegistry;

  public constructor(bus: CoreEventBus, plugins: PluginRegistry) {
    super(bus);
    this.plugins = plugins;
  }

  public supports(event: E): boolean {
    return this.plugins.supports(event);
  }

  public process(event: E) {
    for (const plugin of this.plugins.getAllSupporting(event)) {
      try {
        if (plugin.process({ event, events: this.bus })) {
          return;
        }
      } catch (e) {
        this.emit(new ErrorEvent({ error: e }));
      }
    }

    return event;
  }
}
