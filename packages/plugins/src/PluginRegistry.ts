import { CoreEvent } from '@intent/kernel';
import { Plugin } from './Plugin';

export class PluginRegistry {
    private readonly plugins: Plugin[] = [];

    register(plugin: Plugin) {
        this.plugins.push(plugin);
    }

    public supports(event: CoreEvent): boolean {
        return !!this.plugins.find((plugin) => plugin.supports(event));
    }

    getAllSupporting(event: CoreEvent) {
        return this.plugins.filter((plugin) => plugin.supports(event));
    }
}
