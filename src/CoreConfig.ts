import { Container, UnitMatcher } from '@intent/utils';

export interface PathsConfig {
    project: string;
    internal: string;
    internalName: string;
}

export interface EntryConfig {
    path: string;
    test: UnitMatcher[];
}

export interface EmitConfig {
    files: boolean;
    stats: boolean;
    config: boolean;
    verbose: boolean;
}

export interface OutputConfig {
    path: string;
    extension: string;
}

export interface InterpreterConfig {
}

export interface CoreConfig {
    paths: PathsConfig;
    entry: Container<EntryConfig>;
    emit: EmitConfig;
    output: OutputConfig;
    interpreter: InterpreterConfig;
}
