export interface SamplerInterface {
    placeholder(key: string): string;
    next(subject: string | null, from?: number): MatchedPlaceholder | null;
    prev(subject: string | null, from?: number): MatchedPlaceholder | null;
}

export interface MatchedPlaceholder {
    key: string;
    open: number;
    close: number;
    next: number;
}
