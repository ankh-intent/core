
export interface TemplateInterface<S, R> {
  apply(data: S): R;
}
