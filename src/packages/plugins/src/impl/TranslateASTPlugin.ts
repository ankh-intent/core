import { Identifiable } from '../../../../kernel';
import { TreeNode } from '../../../ast';
import { InterpretPlugin } from '../phases';
import { Scope } from '../traversion';

export abstract class TranslateASTPlugin<N extends TreeNode, T extends Identifiable<N>, C> extends InterpretPlugin<N, T, C> {

}
