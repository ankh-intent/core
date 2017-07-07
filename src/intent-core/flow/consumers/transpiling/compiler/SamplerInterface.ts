
export interface SamplerInterface {
  placeholder(key: string): string;
  next(subject: string, from?: number): MatchedPlaceholder;
  prev(subject: string, from?: number): MatchedPlaceholder;
}

export interface MatchedPlaceholder {
  key: string;
  open: number;
  close: number;
  next: number;
}
