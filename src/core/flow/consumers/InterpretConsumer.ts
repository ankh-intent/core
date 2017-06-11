
import { CoreEvent } from '../CoreEvent';
import { AbstractConsumer } from '../AbstractConsumer';

import { CompiledEvent } from '../events/CompiledEvent';
import { ChipNode } from '../../ast/ChipNode';
import { UseNode } from '../../ast/UseNode';
import { DomainNode } from '../../ast/DomainNode';
import { PropertyNode } from '../../ast/PropertyNode';
import { TypeDefNode } from '../../ast/TypeDefNode';
import { TypeNode } from '../../ast/TypeNode';
import { InterpretedEvent } from '../events/InterpretedEvent';

export class InterpretConsumer extends AbstractConsumer<CompiledEvent, any>{
  public supports(event: CoreEvent<any>): boolean {
    return event.type === CompiledEvent.type();
  }

  public process(event: CompiledEvent) {
    let { chip } = event.data;
    this.bus.stat({
      type: 'interpret',
      chip,
    });

    return new InterpretedEvent({
      chip,
      content: this.chip(chip.ast),
    });
  }

  protected chip(chip: ChipNode): string {
    return `
      ${this.uses(chip.uses).join("\n      ")}
      (() => ({
        ${chip.name}: {
          ${this.domains(chip.domains).join("\n          ")}
        }
      }))();
    `;
  }

  protected uses(uses: {[name: string]: UseNode}): string[] {
    return Object.keys(uses)
      .map((name) => uses[name])
      .map((use: UseNode) => `// ${this.use(use)}`)
    ;
  }

  protected use(use: UseNode): string {
    let full = use.qualifier.path('.');

    return (use.alias !== use.qualifier.deepest())
      ? `use ${full} as ${use.alias};`
      : `use ${full};`;
  }

  protected domains(domains: {[name: string]: DomainNode}): string[] {
    return Object.keys(domains)
      .map((name) => domains[name])
      .map((domain: DomainNode) => this.domain(domain))

  }

  protected domain(domain: DomainNode): string {
    return `${domain.identifier}: {
            ${this.typedefs(domain.types).join("\n            ")}
          }`;
  }

  protected typedefs(typedefs: {[name: string]: TypeDefNode}): string[] {
    return Object.keys(typedefs)
      .map((name) => typedefs[name])
      .map((typedef: TypeDefNode) => `${typedef.name}: ${this.typedef(typedef)},`)

  }

  protected typedef(typedef: TypeDefNode): string {
    return `class ${typedef.name}${typedef.parent ? ` extends ${typedef.parent.qualifier.path('.')}` : ``} {
              ${this.properties(typedef.properties).join("\n              ")}
            }`;
  }

  protected properties(properties: {[name: string]: PropertyNode}): string[] {
    return Object.keys(properties)
      .map((name) => properties[name])
      .map((property: PropertyNode) => this.property(property))

  }

  protected property(property: PropertyNode): string {
    return `${property.name}: ${this.type(property.type)};`;
  }

  protected type(type: TypeNode): string {
    return type.qualifier.path('.') + (
      type.generic
        ? `<${this.type(type.generic)}>`
        : ``
    );
  }
}
