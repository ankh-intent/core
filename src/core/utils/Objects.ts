export class Objects {
  public static is(v: any): boolean {
    return !!(v && (v === Object(v)));
  }
}
