
export interface TemplateInterface<S, R> {
  apply(data: S): R;
}

export interface TemplateFactoryInterface<S, R> {
  (code: string): TemplateInterface<S, R>;
}
