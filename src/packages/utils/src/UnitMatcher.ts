export interface UnitMatcher {
  pattern: string | RegExp;
}

export interface WatchMatcher extends UnitMatcher {
  pattern: string | RegExp;
  event: string;
}
