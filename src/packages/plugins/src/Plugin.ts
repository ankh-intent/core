import {
    ReadedEvent,
    ParsedEvent,
    PatchedASTEvent,
    DependencyModifiedEvent,
    InterpretedEvent, EmittedEvent,
} from '../../../consumers';
import { CoreEvent, CoreEventBus, UpdateEvent } from '../../../kernel';

export enum PluginPhase {
    Update,
    Read,
    Parse,
    Patch,
    Sync,
    Interpret,
    Emit,
}

export interface PluginEnvironment<E extends CoreEvent> {
    event: E;
    events: CoreEventBus;
}

export abstract class Plugin<E extends CoreEvent = CoreEvent> {
    constructor(
        public phase: PluginPhase,
    ) {
    }

    public supports(event: E) {
        switch (this.phase) {
            case PluginPhase.Update:
                return event.type === UpdateEvent.type();
            case PluginPhase.Read:
                return event.type === ReadedEvent.type();
            case PluginPhase.Parse:
                return event.type === ParsedEvent.type();
            case PluginPhase.Patch:
                return event.type === PatchedASTEvent.type();
            case PluginPhase.Sync:
                return event.type === DependencyModifiedEvent.type();
            case PluginPhase.Interpret:
                return event.type === InterpretedEvent.type();
            case PluginPhase.Emit:
                return event.type === EmittedEvent.type();
        }

        return false;
    }

    public process(env: PluginEnvironment<E>): boolean | void {

    }
}
