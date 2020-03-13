import { UseNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type UseTranslatorChildren = {
};

export class UseTranslator extends NodeTranslator<UseNode, UseTranslatorChildren> {
  translate(node: UseNode, context): string {
    return `() => \`${node.decomposition.astRegion.extract().replace(/\n/g, ' ').replace(/\s*,\s*$/m, '')}\``;
  }
}
