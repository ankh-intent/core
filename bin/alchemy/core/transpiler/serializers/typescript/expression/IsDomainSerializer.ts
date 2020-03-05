import { IsDomainNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface IsDomainSerializerChildren {
}

export class IsDomainSerializer extends NodeSerializer<IsDomainNode, IsDomainSerializerChildren> {
  serialize(node: IsDomainNode, context): string {
    return `/* type reference */instanceof ` + node.right.astRegion.extract();
  }
}
