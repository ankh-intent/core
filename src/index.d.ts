import { UnitMatcher } from 'intent-watchdog';
export interface WatchOptions {
    debounce: number;
}
export interface CoreOptions {
    files: UnitMatcher[];
    watch?: WatchOptions;
}
export declare class Core {
    private watchdog;
    private watches;
    private files;
    constructor();
    bootstrap(options: CoreOptions): Core;
    protected watch(files: UnitMatcher[]): void;
}
