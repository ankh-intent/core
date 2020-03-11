import { Scope } from '@intent/plugins';

interface SerializingScopeInterface {
}

class TranslationScope extends Scope<SerializingScopeInterface, keyof SerializingScopeInterface> {
  nest(): this {
    return Reflect.construct(this.constructor, [
      Object
        .entries(this.data)
        .reduce(((acc, [name, scope]) => Object.assign(acc, { [name]: scope.nest() })), {}),
      this,
    ]);
  }
}

export class TranslationContext extends TranslationScope {
  public static createContext() {
    return new this({
      // variables: new Scope({}),
    });
  }
}
