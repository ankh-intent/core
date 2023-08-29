import { BuilderInvokers, InvokableVisitors } from '@intent/kernel';
import { DereferenceNode, ObjectSpreadNode, ObjectSpreadItemNode } from '@alchemy/ast';

import { DereferenceChildren, DereferenceBuilder } from './DereferenceBuilder';
import { ObjectSpreadChildren, ObjectSpreadBuilder } from './ObjectSpreadBuilder';
import { ObjectSpreadItemChildren, ObjectSpreadItemBuilder } from './ObjectSpreadItemBuilder';

export type DereferenceInvokers = {
    dereference: DereferenceNode;
    object_spread: ObjectSpreadNode;
    object_spread_item: ObjectSpreadItemNode<ObjectSpreadNode>;
};

export type DereferenceDependencies =
    DereferenceChildren &
    ObjectSpreadChildren &
    ObjectSpreadItemChildren
    ;

export const factory = (invokers: BuilderInvokers<DereferenceDependencies>): InvokableVisitors<DereferenceInvokers> => {
    return {
        dereference: new DereferenceBuilder(invokers),
        object_spread: new ObjectSpreadBuilder(invokers),
        object_spread_item: new ObjectSpreadItemBuilder(invokers),
    };
};
