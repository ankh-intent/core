import { TranslationContext } from '@intent/translator';
import { FunctorArgs } from '@alchemy/modules';
import { FunctorArgsNode, FunctorArgNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type FunctorArgsTranslatorChildren = {
    functor_arg: FunctorArgNode;
};

export class FunctorArgsTranslator extends AlchemyNodeTranslator<FunctorArgs, FunctorArgsTranslatorChildren> {
    translate(node: FunctorArgsNode, context: TranslationContext<any>): FunctorArgs {
        return FunctorArgs.create(node, context.parent, {
            args: node.args.map((arg) => this.child.functor_arg(arg, context)),
        });
    }
}
