import { Container, Eventable } from '@intent/utils';
import { TreeNode } from '@intent/ast';

import { DependencyNode, Identifiable } from './DependencyNode';

export class DependencyManager<N extends TreeNode, T extends Identifiable<N>> extends Eventable {
    static RETAIN = 'retain';
    static RELEASE = 'release';

    public readonly roots: Container<DependencyNode<N, T>> = {};

    public onRetain(handler: Function, once?: boolean): number {
        return (
            once
                ? this.once(DependencyManager.RETAIN, handler)
                : this.on(DependencyManager.RETAIN, handler)
        );
    }

    public onRelease(handler: Function, once?: boolean): number {
        return (
            once
                ? this.once(DependencyManager.RELEASE, handler)
                : this.on(DependencyManager.RELEASE, handler)
        );
    }

    public contains(predicate: (nodes: DependencyNode<N, T>) => boolean): DependencyNode<N, T> | null {
        for (const node of Object.values(this.roots)) {
            if (predicate(node)) {
                return node;
            }
        }

        return null;
    }

    public find(identifier: string): DependencyNode<N, T> | null {
        for (const root of Object.values(this.roots)) {
            const found = root.related(identifier);

            if (found) {
                return found;
            }
        }

        return null;
    }

    public add(identifiable: T): DependencyNode<N, T> {
        const node = this.roots[identifiable.uri] || (
            this.roots[identifiable.uri] = this.buildNode(identifiable)
        );

        this.emit(DependencyManager.RETAIN, node);

        return node;
    }

    public dependency(identifiable: T): DependencyNode<N, T> {
        return this.find(identifiable.uri) || this.add(identifiable);
    }

    public dependants(identifiable: T): DependencyNode<N, T> {
        return new DependencyNode<N, T>(identifiable);
    }

    protected buildNode(identifiable: T): DependencyNode<N, T> {
        const node = new DependencyNode<N, T>(identifiable);

        node.relate(
            Object.keys(identifiable.linked)
                .map((identifier) => this.buildNode(<T>identifiable.linked[identifier])),
        );

        return node;
    }

    public all(identifiers: string[] | null = null, filter: boolean = true): (DependencyNode<N, T> | string)[] {
        if (!identifiers) {
            return Object.values(this.roots);
        }

        const nodes = identifiers.map((identifier) => this.roots[identifier]);

        return (
            filter
                ? nodes.filter(Boolean)
                : nodes.map((node, index) => node || identifiers[index])
        );
    }

    public remove(node: DependencyNode<N, T>): number {
        let released = +(delete this.roots[node.uri]);

        for (const root of Object.values(this.roots)) {
            released += +root.release(node);
        }

        for (const dependency of node) {
            this.dereference(node, dependency);
        }

        this.emit(DependencyManager.RELEASE, node);

        return released;
    }

    public dereference(parent: DependencyNode<N, T>, dependency: DependencyNode<N, T>): boolean {
        if (!parent.release(dependency)) {
            return false;
        }

        const identifier = dependency.uri;

        for (const root of Object.values(this.roots)) {
            if (root === dependency) {
                continue;
            }

            if (root.related(identifier)) {
                return false;
            }
        }

        return !!this.remove(dependency);
    }
}
