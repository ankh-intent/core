
export interface SamplerInterface {
  placeholder(key: string): string;
  next(subject: string, from?: number): {};
}

export interface MatchedPlaceholder {
  key: string;
  open: number;
  close: number;
  next: number;
}
