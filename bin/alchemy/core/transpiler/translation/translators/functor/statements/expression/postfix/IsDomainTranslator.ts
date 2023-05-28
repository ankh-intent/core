import { IsDomain } from '../../../../../../../modules';
import { IsDomainNode, ReferenceNode } from '../../../../../../ast';
import { NodeTranslator } from '../../../../../NodeTranslator';

export type IsDomainTranslatorChildren = {
    reference: ReferenceNode;
};

export class IsDomainTranslator extends NodeTranslator<IsDomain, IsDomainTranslatorChildren> {
    translate(node: IsDomainNode, c): IsDomain {
        return IsDomain.create(node, c.parent, {
            right: this.child.reference(node.right, c),
        });
    }
}
