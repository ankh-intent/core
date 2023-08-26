import { IsDomainNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type IsDomainSerializerChildren = {};

export class IsDomainSerializer extends NodeSerializer<IsDomainNode, IsDomainSerializerChildren> {
    serialize(node: IsDomainNode, context: SerializingContext): string {
        return `/* type reference */instanceof ` + node.right.astRegion.extract();
    }
}
