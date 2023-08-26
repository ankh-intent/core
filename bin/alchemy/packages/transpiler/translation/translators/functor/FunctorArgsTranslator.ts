import { FunctorArgs } from '@alchemy/modules';
import { FunctorArgsNode, FunctorArgNode } from '@alchemy/ast';
import { NodeTranslator } from '../../NodeTranslator';
import { TranslationContext } from '../../TranslationContext';

export type FunctorArgsTranslatorChildren = {
    functor_arg: FunctorArgNode;
};

export class FunctorArgsTranslator extends NodeTranslator<FunctorArgs, FunctorArgsTranslatorChildren> {
    translate(node: FunctorArgsNode, context: TranslationContext<any>): FunctorArgs {
        return FunctorArgs.create(node, context.parent, {
            args: node.args.map((arg) => this.child.functor_arg(arg, context)),
        });
    }
}
