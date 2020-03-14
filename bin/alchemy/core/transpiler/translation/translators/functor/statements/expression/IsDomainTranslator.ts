import { IsDomainNode } from '../../../../../ast';
import { NodeTranslator } from '../../../../NodeTranslator';

export type IsDomainTranslatorChildren = {
};

export class IsDomainTranslator extends NodeTranslator<IsDomainNode, IsDomainTranslatorChildren> {
  translate(node: IsDomainNode, context): string {
    return `/* type reference */instanceof ` + node.right.astRegion.extract();
  }
}
