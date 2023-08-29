import { Container, Scope, ScopeInterface, AbstractNode } from '@intent/kernel';
import { SerializingScope } from '@intent/translator';
import {
    DomainNode,
    ExpressionNode,
    FunctorArgsNode,
    FunctorNode,
    ReferenceNode,
    QualifierNode,
    TypeGenericNode,
} from '@alchemy/ast';

export interface Variable {
    local: string;
    type: ReferenceNode;
}

export interface InlineType {
    local: string;
    type: ReferenceNode;
    definition: Container<ReferenceNode>;
}

interface ASerializingScopeInterface {
    variables: ScopeInterface<Container<Variable>>;
    types: ScopeInterface<Container<InlineType>>;
}

export class SerializingContext extends SerializingScope<ASerializingScopeInterface> {
    public static createContext() {
        return new this({
            variables: new Scope(),
            types: new Scope(),
        });
    }

    get variables(): ScopeInterface<Container<Variable>> {
        return this.items.variables;
    }

    get types(): ScopeInterface<Container<InlineType>> {
        return this.items.types;
    }

    getLocalIdentifier(variable: string): string | null {
        return this.variables.get(variable)?.local || null;
    }

    domainType(domain: DomainNode): { type: ReferenceNode, domainType: ReferenceNode } {
        const type = new ReferenceNode(
            new QualifierNode(domain.identifier),
            new TypeGenericNode<ReferenceNode>(
                <ReferenceNode[]>domain.generics.templates.filter((template) => !!template.parent).map((template) => template.parent),
            ),
        );
        const domainType = new ReferenceNode(
            new QualifierNode('Domain'),
            new TypeGenericNode<ReferenceNode>([type]),
        );

        return {
            type,
            domainType,
        };
    }

    functorType(functor: FunctorNode): ReferenceNode {
        return new ReferenceNode(
            new QualifierNode('Callable'),
            new TypeGenericNode<ReferenceNode>(
                [
                    new ReferenceNode(new QualifierNode('Arguments'), new TypeGenericNode<ReferenceNode>([
                        functor.returns || new ReferenceNode(new QualifierNode('Void'), new TypeGenericNode<ReferenceNode>()),
                        ...functor.args.args.map((arg) => arg.type),
                    ])),
                ],
            ),
        );
    }

    anyType(node: AbstractNode): ReferenceNode {
        return Object.assign(new ReferenceNode(Object.assign(new QualifierNode('Any'), {
            astRegion: node.astRegion,
        }), null), {
            astRegion: node.astRegion,
        });
    }

    inferExpressionType(_expression: ExpressionNode): ReferenceNode {
        return new ReferenceNode(new QualifierNode('Any'), null);
    }

    argsType(node: FunctorArgsNode): InlineType {
        const type = new ReferenceNode(new QualifierNode(`$Arguments${this.types.size}`), null);
        const definition: Container<ReferenceNode> = {};
        const local = `$args_${this.types.size + 1}`;

        for (const arg of node.args) {
            definition[arg.name] = arg.type;

            this.variables.set(arg.name, {
                local: `${local}.${arg.name}`,
                type: arg.type,
            });
        }

        return this.types.set('arguments', {
            local,
            type: new ReferenceNode(new QualifierNode('Arguments'), new TypeGenericNode<ReferenceNode>([
                type,
            ])),
            definition,
        });
    }
}
