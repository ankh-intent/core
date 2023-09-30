import { ReferenceNode } from '@alchemy/ast';
import { Operation } from '../Operation';

export class IsDomain extends Operation<ReferenceNode> {
    public readonly binary = true;
    public readonly operation = 'is';
}
