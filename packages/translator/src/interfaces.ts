import { TreeNode } from '@intent/kernel';
import { Translated } from './Translated';

export type TranslatedConstructor<T extends Translated<N, P>, N extends TreeNode = any, P extends TreeNode = any> = {
    new(ast?: N, parentNode?: Translated<P>): T;

    create<
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
    create<T extends TranslatedConstructor<Translated<any>>, N extends InstanceType<T>, P extends Translated<any>>(
        this: T,
        parentNode: P,
        factoryOrData?: TranslatedFactory<N>,
    ): N;
    create<T extends TranslatedConstructor<Translated<any>>, N extends InstanceType<T>>(
        this: T,
        factoryOrData?: TranslatedFactory<N>,
    ): N;
};

export type TranslatedFactory<T> = Partial<T> | ((intermediate: T) => Partial<T>);
