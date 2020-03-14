import { FunctorArgs } from '../../../../modules/functor';
import { FunctorArgsNode, FunctorArgNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type FunctorArgsTranslatorChildren = {
  functor_arg: FunctorArgNode;
};

export class FunctorArgsTranslator extends NodeTranslator<FunctorArgs, FunctorArgsTranslatorChildren> {
  translate(node: FunctorArgsNode, c): FunctorArgs {
    return FunctorArgs.create(node, c.parent, {
      args: node.args.map((arg) => this.child.functor_arg(arg, c)),
    });
  }
}
