import { InvokableVisitors, NodeInvokers } from '@intent/plugins';

import { UseNode, UsesNode, DecompositionNode } from '../../../ast';
import { DecompositionTranslatorChildren, DecompositionTranslator } from './DecompositionTranslator';
import { UseTranslator, UseTranslatorChildren } from './UseTranslator';
import { UsesTranslator, UsesTranslatorChildren } from './UsesTranslator';

export type UseInvokers = {
    use: UseNode;
    uses: UsesNode;
    decomposition: DecompositionNode;
};

export type UseDependencies =
    DecompositionTranslatorChildren &
    UseTranslatorChildren &
    UsesTranslatorChildren
    ;

export const factory = (invokers: NodeInvokers<UseDependencies>): InvokableVisitors<UseInvokers> => {
    return {
        use: new UseTranslator(invokers),
        uses: new UsesTranslator(invokers),
        decomposition: new DecompositionTranslator(invokers),
    };
};
