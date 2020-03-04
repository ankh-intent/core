import { Container } from '@intent/utils';
import { TypeNode } from '../ast/reference';

class Scope<T> {
  private readonly parent?: Scope<T>;
  protected readonly items: T;

  constructor(items: T, parent?: Scope<T>) {
    this.items = items;
    this.parent = parent;
  }

  nest() {
    return Reflect.construct(this.constructor, [this]);
  }

  get depth(): number {
    return 1 + (this.parent?.depth || 0);
  }

  get size() {
    return Object.keys(this.items).length;
  }

  set<N extends keyof T>(name: N, value: T[N]) {
    this.items[name] = value;

    return this;
  }

  delete<N extends keyof T>(name: N) {
    return delete this.items[name];
  }

  get<N extends keyof T>(name: N): T[N]|null {
    return this.items[name] || this.parent?.get(name) || null;
  }
}

interface Variable {
  local: string;
  type: TypeNode;
}

interface SerializingScopeInterface {
  variables: Scope<{[name: string]: Variable}>;
}

class SerializingScope extends Scope<SerializingScopeInterface>{
  nest() {
    return Reflect.construct(this.constructor, [
      Object
        .entries(this.items)
        .reduce(((acc, [name, scope]) => (acc[name] = scope.nest(), acc)), {}),
      this,
    ]);
  }
}

export class SerializingContext extends SerializingScope {
  public static createContext() {
    return new this({
      variables: new Scope({}),
    });
  }

  get variables(): Scope<Container<Variable>> {
    return this.items.variables;
  }

  getLocalIdentifier(variable: string): string|null {
    return this.variables.get(variable)?.local || null;
  }
}
