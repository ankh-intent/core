import { TreeNode } from '@intent/kernel';
import { TranslatedFactory, TranslatedConstructor } from './interfaces';
import { inspect, InspectOptionsStylized } from 'node:util';

const isASTNode = <AST extends TreeNode>(node?: any): node is AST => (
    !!(node && node.astRegion)
);
const isTranslated = <P extends Translated<any>, N extends Translated<any>>(nodeOrFactory?: P | TranslatedFactory<N>): nodeOrFactory is P => (
    nodeOrFactory instanceof Translated
);
const isFactory = <N>(factoryOrData?: TranslatedFactory<N>): factoryOrData is TranslatedFactory<N> => (
    typeof factoryOrData === 'function'
);

export class Translated<N extends TreeNode, P extends TreeNode = any> {
    constructor(public ast?: N | undefined, public parentNode?: Translated<P>) {
    }

    static create<
        T extends TranslatedConstructor<Translated<AST, PN>>,
        N extends InstanceType<T>,
        P extends Translated<PN>,
        AST extends TreeNode,
        PN extends TreeNode,
    >(
        this: T,
        ast: AST,
        parentNode: P | undefined,
        factoryOrData?: TranslatedFactory<N>,
    ): N;
    static create<T extends TranslatedConstructor<Translated<any>>, N extends InstanceType<T>, P extends Translated<any>>(
        this: T,
        parentNode: P,
        factoryOrData?: TranslatedFactory<N>,
    ): N;
    static create<T extends TranslatedConstructor<Translated<any>>, N extends InstanceType<T>>(
        this: T,
        factoryOrData?: TranslatedFactory<N>,
    ): N;

    static create<
        T extends TranslatedConstructor<Translated<AST, PN>>,
        N extends InstanceType<T>,
        P extends Translated<PN>,
        AST extends TreeNode,
        PN extends TreeNode,
    >(this: T, ...args: any[]): N {
        let ast: AST | undefined;
        let parent: P | undefined;
        let factory: TranslatedFactory<N> | undefined;
        let partial: Partial<N> | undefined;

        for (const arg of args) {
            if (isASTNode<AST>(arg)) {
                ast = arg;
            } else if (isTranslated<P, N>(arg)) {
                parent = arg;
            } else if (isFactory<N>(arg)) {
                factory = arg;
            } else {
                partial = arg;
            }
        }

        const node = new this(ast, parent) as N;
        const data = typeof factory === 'function' ? factory(node) : partial;

        return (
            data
                ? Object.assign(node, data)
                : node
        );
    }

    [inspect.custom](depth: number, options: InspectOptionsStylized) {
        const { ast, parentNode, ...rest } = this;
        const set = (options as any).set || new Map();

        if (set.has(this)) {
            return options.stylize(this.constructor.name, 'special') + ` (#${set.get(this)})`;
        }

        set.set(this, set.size + 1);
        const filtered = Object.fromEntries(Object.entries(rest).filter(([, value]) => {
            if (value && typeof value === 'object') {
                return !(('length' in (value as any)) && !(value as any).length);
            }

            return value ?? false;
        }));
        const values = Object.values(filtered);
        const result = (
            values.length === 1
                ? '(' + inspect(values[0], { ...options, set } as any) + ')'
                : ' ' + inspect(filtered, { ...options, set } as any)
        );

        return options.stylize(this.constructor.name, 'special') + result;
    }
}
