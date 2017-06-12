
import { CoreEvent } from '../CoreEvent';
import { AbstractConsumer } from '../AbstractConsumer';

import { CompiledEvent } from '../events/CompiledEvent';
import { ChipNode } from '../../intent/ast/ChipNode';
import { UseNode } from '../../intent/ast/UseNode';
import { DomainNode } from '../../intent/ast/DomainNode';
import { PropertyNode } from '../../intent/ast/PropertyNode';
import { TypeDefNode } from '../../intent/ast/TypeDefNode';
import { TypeNode } from '../../intent/ast/TypeNode';
import { InterpretedEvent } from '../events/InterpretedEvent';
import { CanNode } from '../../intent/ast/CanNode';
import { StringSource } from '../../source/StringSource';

export class InterpretConsumer extends AbstractConsumer<CompiledEvent, any>{
  public supports(event: CoreEvent<any>): boolean {
    return event.type === CompiledEvent.type();
  }

  public process(event: CompiledEvent) {
    let { chip } = event.data;
    this.stat(event, {
      type: 'interpret',
      chip,
    });

    let resolved = chip.path.replace(/\.int$/, '.js');

    return new InterpretedEvent({
      chip,
      content: new StringSource(this.chip(chip.ast), resolved),
    });
  }

  protected chip(chip: ChipNode): string {
    return this.uses(chip.uses).join("\n") +
      `\n(() => ({\n` +
      this.tab(
        `${chip.name}: {\n` +
        this.tab(
          this.domains(chip.domains).join("\n"),
          2
        ) +
        `\n}\n` +
        (chip.can ? `return ` + this.can(chip.can) : ''),
        2) +
      `\n}))();\n`;
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
    return `${domain.identifier}: {\n` +
      this.tab(
        this.typedefs(domain.types).join("\n"),
        2
      ) +
      `\n}`;
  }

  protected typedefs(typedefs: {[name: string]: TypeDefNode}): string[] {
    return Object.keys(typedefs)
      .map((name) => typedefs[name])
      .map((typedef: TypeDefNode) => `${typedef.name}: ${this.typedef(typedef)},`)
    ;
  }

  protected typedef(typedef: TypeDefNode): string {
    return this.tab(
      `class ${typedef.name}` +
      (typedef.parent ? ` extends ${typedef.parent.qualifier.path('.')}` : ``) +
      ` {\n` +
      this.tab(
        this.properties(typedef.properties)
          .map((l) => `public ${l};`)
          .concat(this.cans(typedef.can))
          .join("\n"),
        2
      ) +
      `\n}`,
      0
    );
  }

  protected properties(properties: {[name: string]: PropertyNode}): string[] {
    return Object.keys(properties)
      .map((name) => properties[name])
      .map((property: PropertyNode) => this.property(property))

  }

  protected property(property: PropertyNode): string {
    return `${property.name}: ${this.type(property.type)}`;
  }

  protected type(type: TypeNode): string {
    return type.qualifier.path('.') + (
      type.generic
        ? `<${this.type(type.generic)}>`
        : ``
    );
  }

  protected cans(cans: {[name: string]: CanNode}): string[] {
    return Object.keys(cans)
      .map((name) => cans[name])
      .map((can: CanNode) => this.can(can))
    ;
  }

  protected can(can: CanNode): string {
    return `${can.name}(${this.properties(can.args).join(", ")})` +
      (can.returns ? ': ' + this.type(can.returns) : '') +
      ` {\n` +
      this.tab(can.body, 2) +
      `\n}`;
  }

  public tab(text: string, len: number): string {
    return text.trim().split('\n').map((line) => ' '.repeat(len) + line).join('\n');
  }
}
