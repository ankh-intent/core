import { Container } from '@intent/utils';
import { DomainNode } from '../ast/domain';
import { ExpressionNode } from '../ast/expression';
import { FunctorArgsNode, FunctorNode } from '../ast/functor';
import { ReferenceNode, QualifierNode, TypeGenericNode } from '../ast/reference';

class Scope<T, N extends keyof T = keyof T> {
  private readonly parent?: Scope<T, N>;
  protected readonly items: T;

  constructor(items: T, parent?: Scope<T, N>) {
    this.items = items;
    this.parent = parent;
  }

  nest(): this {
    return Reflect.construct(this.constructor, [{}, this]);
  }

  get depth(): number {
    return 1 + (this.parent?.depth || 0);
  }

  get size() {
    return Object.keys(this.items).length;
  }

  set(name: N, value: T[N]) {
    this.items[name] = value;

    return value;
  }

  delete(name: N) {
    return delete this.items[name];
  }

  get(name: N): T[N]|null {
    return this.items[name] || this.parent?.get(name) || null;
  }
}

interface Variable {
  local: string;
  type: ReferenceNode;
}

interface InlineType {
  local: string;
  type: ReferenceNode;
  definition: Container<ReferenceNode>;
}

interface SerializingScopeInterface {
  variables: Scope<Container<Variable>, string>;
  types: Scope<Container<InlineType>, string>;
}

class SerializingScope extends Scope<SerializingScopeInterface>{
  nest(): this {
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
      types: new Scope({}),
    });
  }

  get variables(): Scope<Container<Variable>, string> {
    return this.items.variables;
  }

  get types(): Scope<Container<InlineType>, string> {
    return this.items.types;
  }

  getLocalIdentifier(variable: string): string|null {
    return this.variables.get(variable)?.local || null;
  }

  domainType(domain: DomainNode): { type: ReferenceNode, domainType: ReferenceNode } {
    const type = new ReferenceNode(
      new QualifierNode(domain.identifier),
      new TypeGenericNode<ReferenceNode>(
        <ReferenceNode[]>domain.generics.templates.filter((template) => !!template.parent).map((template) => template.parent),
      ),
    );
    const domainType = new ReferenceNode(
      new QualifierNode('Domain'),
      new TypeGenericNode<ReferenceNode>([type]),
    );

    return {
      type,
      domainType,
    }
  }

  functorType(functor: FunctorNode): ReferenceNode {
    return new ReferenceNode(
      new QualifierNode('Callable'),
      new TypeGenericNode<ReferenceNode>(
        [
          new ReferenceNode(new QualifierNode('Arguments'), new TypeGenericNode<ReferenceNode>([
            functor.returns || new ReferenceNode(new QualifierNode('Void'), new TypeGenericNode<ReferenceNode>()),
            ...functor.args.args.map((arg) => arg.type),
          ])),
        ]
      ),
    );
  }

  inferType(expression: ExpressionNode): ReferenceNode {
    return new ReferenceNode(new QualifierNode('Any'), null);
  }

  argsType(node: FunctorArgsNode): InlineType {
    const type = new ReferenceNode(new QualifierNode(`$Arguments${this.types.size}`), null);
    const definition = {};
    const local = `$args_${this.types.size + 1}`;

    for (const arg of node.args) {
      definition[arg.name] = arg.type;

      this.variables.set(arg.name, {
        local: `${local}.${arg.name}`,
        type: arg.type,
      });
    }

    return this.types.set('arguments', {
      local,
      type: new ReferenceNode(new QualifierNode('Arguments'), new TypeGenericNode<ReferenceNode>([
        type,
      ])),
      definition,
    });
  }
}
