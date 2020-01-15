import { Container } from '../../utils';
import { TreeNode } from '../ast';

export interface Identifiable<N extends TreeNode> {
  identifier: string;
  linked: Container<Identifiable<N>>;
  ast: N;
}

export class DependencyNode<N extends TreeNode, T extends Identifiable<N>> implements Iterable<DependencyNode<N, T>> {
  private readonly _related: DependencyNode<N, T>[];

  public readonly identifiable: T;

  public constructor(identifiable: T, related: DependencyNode<N, T>[] = []) {
    this.identifiable = identifiable;
    this._related = related;
  }

  public get identifier(): string {
    return this.identifiable.identifier;
  }

  public relations(): DependencyNode<N, T>[] {
    return this._related;
  }

  public [Symbol.iterator](): IterableIterator<DependencyNode<N, T>> {
    return this._related[Symbol.iterator]();
  }

  public relate(nodes: DependencyNode<N, T>[]): DependencyNode<N, T>[] {
    for (const node of nodes) {
      if (!this._related.includes(node)) {
        this._related.push(node);
      }
    }

    return nodes;
  }

  public related(identifier: string): DependencyNode<N, T>|null {
    if (this.identifier === identifier) {
      return this;
    }

    for (const node of this._related) {
      const found = node.related(identifier);

      if (found) {
        return found;
      }
    }

    return null;
  }

  public release(node: DependencyNode<N, T>): boolean {
    const index = this._related.indexOf(node);

    if (index >= 0) {
      this._related.splice(index, 1);
    }

    return index >= 0;
  }
}
