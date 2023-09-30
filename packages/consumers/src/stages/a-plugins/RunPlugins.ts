import { AbstractConsumer, CoreEvent, CoreEventBus, CoreStat, ErrorEvent, LogTypeName } from '@intent/kernel';
import { PluginRegistry } from '@intent/plugins';

export class RunPlugins<E extends CoreEvent = CoreEvent> extends AbstractConsumer<E, any> {
    private readonly plugins: PluginRegistry;

    public constructor(bus: CoreEventBus, plugins: PluginRegistry) {
        super(bus);
        this.plugins = plugins;
    }

    public supports(event: E): boolean {
        return this.plugins.supports(event);
    }

    public process(event: E) {
        const env = {
            stat: (data: CoreStat<any, any>): CoreEvent => this.bus.stat(event, data),
            log: (message: Partial<Record<LogTypeName, any>>) => this.bus.log(event, message),
            events: this.bus,
            event,
        };

        for (const plugin of this.plugins.getAllSupporting(event)) {
            try {
                if (plugin.process(env)) {
                    return;
                }
            } catch (error) {
                this.emit(new ErrorEvent({ error }, event));
            }
        }

        return event;
    }
}
