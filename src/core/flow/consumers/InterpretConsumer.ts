
import { CoreEvent } from '../CoreEvent';
import { AbstractConsumer } from '../AbstractConsumer';

import { CompiledEvent } from '../events/CompiledEvent';
import { InterpretedEvent } from '../events/InterpretedEvent';
import { StringSource } from '../../source/StringSource';
import { Substitutor } from '../transpiler/templates/Substitutor';
import { TemplateVisitor } from '../transpiler/templates/Visitors';
import { CoreEventBus } from '../CoreEventBus';
import { TemplateContext } from '../transpiler/templates/TemplateContext';
import { ChipTranspiler } from '../../intent/transpiler/ChipTranspiler';
import { DomainTranspiler } from '../../intent/transpiler/DomainTranspiler';
import { TemplateVisitors } from "../transpiler/templates/TemplateVisitors";
import { CanTranspiler } from '../../intent/transpiler/CanTranspiler';
import { ArgsTranspiler } from '../../intent/transpiler/ArgsTranspiler';
import { ArrayHeadTranspiler } from '../../intent/transpiler/ArrayHeadTranspiler';
import { ArrayTailTranspiler } from '../../intent/transpiler/ArrayTailTranspiler';
import { DomainsTranspiler } from '../../intent/transpiler/DomainsTranspiler';
import { TypeTranspiler } from '../../intent/transpiler/TypeTranspiler';
import { TypesTranspiler } from "../../intent/transpiler/TypesTranspiler";
import { TypeDefTranspiler } from '../../intent/transpiler/TypeDefTranspiler';
import { TypeDefsTranspiler } from '../../intent/transpiler/TypeDefsTranspiler';
import { ParentTranspiler } from '../../intent/transpiler/ParentTranspiler';
import { PropertiesTranspiler } from '../../intent/transpiler/PropertiesTranspiler';
import { PropertyTranspiler } from '../../intent/transpiler/PropertyTranspiler';

export class InterpretConsumer extends AbstractConsumer<CompiledEvent, any>{
  private visitors: TemplateVisitors<any>;
  private substitutor: Substitutor<any, any>;

  private templates: {
    chip: ChipTranspiler;
    domains: DomainsTranspiler;
    domain: DomainTranspiler;
    typedefs: TypeDefsTranspiler;
    typedef: TypeDefTranspiler;
    types: TypesTranspiler;
    type: TypeTranspiler;
    properties: PropertiesTranspiler;
    property: PropertyTranspiler;
    parent: ParentTranspiler;
    can: CanTranspiler;
    args: ArgsTranspiler,
    "a.head": ArrayHeadTranspiler;
    "a.tail": ArrayTailTranspiler;
  };

  public constructor(bus: CoreEventBus) {
    super(bus);
    this.visitors = new TemplateVisitors();
    this.substitutor = new Substitutor(this.visitors);

    this.templates = {
      chip: new ChipTranspiler(
        this.substitutor,
        this.visitors
      ),
      domain: new DomainTranspiler(
        this.substitutor,
        this.visitors
      ),
      domains: new DomainsTranspiler(
        this.substitutor,
        this.visitors
      ),
      typedefs: new TypeDefsTranspiler(
        this.substitutor,
        this.visitors
      ),
      typedef: new TypeDefTranspiler(
        this.substitutor,
        this.visitors
      ),
      types: new TypesTranspiler(
        this.substitutor,
        this.visitors
      ),
      type: new TypeTranspiler(
        this.substitutor,
        this.visitors
      ),
      properties: new PropertiesTranspiler(
        this.substitutor,
        this.visitors
      ),
      property: new PropertyTranspiler(
        this.substitutor,
        this.visitors
      ),
      parent: new ParentTranspiler(
        this.substitutor,
        this.visitors
      ),
      can: new CanTranspiler(
        this.substitutor,
        this.visitors
      ),
      args: new ArgsTranspiler(
        this.substitutor,
        this.visitors
      ),
      "a.head": new ArrayHeadTranspiler(
        this.substitutor,
        this.visitors
      ),
      "a.tail": new ArrayTailTranspiler(
        this.substitutor,
        this.visitors
      ),
    };

    for (let name of Object.keys(this.templates)) {
      this.visitors.register(
        name,
        new TemplateVisitor(this.templates[name])
      );
    }
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === CompiledEvent.type();
  }

  public process(event: CompiledEvent) {
    let { chip } = event.data;
    this.stat(event, {
      type: 'interpret',
      chip,
    });

    let resolved = chip.path.replace(/\.int$/, '.i.js');
    let content = this.visitors.visit(
      "chip",
      new TemplateContext(
        this.templates.chip,
        chip.ast
      )
    );

    return new InterpretedEvent({
      chip,
      content: new StringSource(
        content.join("\n"),
        resolved
      ),
    });
  }
}
