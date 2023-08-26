import { BuilderInvokers, InvokableVisitors } from '@intent/kernel';

import { DecompositionNode, UseNode, UsesNode } from '../../ast';
import { DecompositionChildren, DecompositionBuilder } from './DecompositionBuilder';
import { UseChildren, UseBuilder } from './UseBuilder';
import { UsesChildren, UsesBuilder } from './UsesBuilder';

export type UseInvokers = {
    decomposition: DecompositionNode;
    use: UseNode;
    uses: UsesNode;
};

export type UseDependencies =
    DecompositionChildren &
    UseChildren &
    UsesChildren;

export const factory = (invokers: BuilderInvokers<UseDependencies>): InvokableVisitors<UseInvokers> => {
    return {
        use: new UseBuilder(invokers),
        uses: new UsesBuilder(invokers),
        decomposition: new DecompositionBuilder(invokers),
    };
};
