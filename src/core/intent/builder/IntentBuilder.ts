
import { Tokens } from '../../parser/Tokens';
import { ASTBuilder } from '../../ASTBuilder';
import { ChipNode } from '../ast/ChipNode';
import { QualifierBuilder } from './QualifierBuilder';
import { TypeBuilder } from './TypeBuilder';
import { PropertyBuilder } from './PropertyBuilder';
import { UseBuilder } from './UseBuilder';
import { TypeDefBuilder } from './TypeDefBuilder';
import { CanBuilder } from './CanBuilder';
import { DomainBuilder } from './DomainBuilder';
import { ChipBuilder } from './ChipBuilder';

export class IntentBuilder implements ASTBuilder<ChipNode> {
  private builders: {
    qualifier: QualifierBuilder;
    type: TypeBuilder;
    property: PropertyBuilder;
    use: UseBuilder;
    typedef: TypeDefBuilder;
    can: CanBuilder;
    domain: DomainBuilder;
    chip: ChipBuilder;
  } = <any>{};

  public constructor() {
    this.builders.qualifier = new QualifierBuilder(this.builders);
    this.builders.type = new TypeBuilder(this.builders);
    this.builders.property = new PropertyBuilder(this.builders);
    this.builders.use = new UseBuilder(this.builders);
    this.builders.typedef = new TypeDefBuilder(this.builders);
    this.builders.can = new CanBuilder(this.builders);
    this.builders.domain = new DomainBuilder(this.builders);
    this.builders.chip = new ChipBuilder(this.builders);
  }

  public build(tokens: Tokens): ChipNode {
    return this.builders.chip.build(tokens);
  }
}

