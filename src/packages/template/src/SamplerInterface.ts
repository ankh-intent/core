export interface SamplerInterface {
  placeholder(key: string): string;

  next(subject: string, from?: number): MatchedPlaceholder | null;

  prev(subject: string, from?: number): MatchedPlaceholder | null;
}

export interface MatchedPlaceholder {
  key: string;
  open: number;
  close: number;
  next: number;
}
