import {
    CoreEvent,
    CoreEventBus,
    UpdateEvent,
    CoreStat,
    ReadedEvent,
    LogMethodName,
    ParsedEvent,
    PatchedASTEvent,
    DependencyModifiedEvent,
    TranspiledEvent,
    EmittedEvent,
} from '@intent/kernel';

export enum PluginPhase {
    Update,
    Read,
    Parse,
    Patch,
    Sync,
    Interpret,
    Emit,
}

const PHASE_TO_EVENT = {
    [PluginPhase.Update]: UpdateEvent.type(),
    [PluginPhase.Read]: ReadedEvent.type(),
    [PluginPhase.Parse]: ParsedEvent.type(),
    [PluginPhase.Patch]: PatchedASTEvent.type(),
    [PluginPhase.Sync]: DependencyModifiedEvent.type(),
    [PluginPhase.Interpret]: TranspiledEvent.type(),
    [PluginPhase.Emit]: EmittedEvent.type(),
};

export interface PluginEnvironment<E extends CoreEvent> {
    event: E;
    events: CoreEventBus;
    stat<T, S>(data: CoreStat<T, S>): CoreEvent;
    log(data: Partial<Record<LogMethodName, any>>): CoreEvent;
}

export abstract class Plugin<E extends CoreEvent = CoreEvent> {
    constructor(public phase: PluginPhase) {
    }

    public supports(event: E) {
        return PHASE_TO_EVENT[this.phase] === event.type;
    }

    public abstract process(_env: PluginEnvironment<E>): boolean | void;
}
