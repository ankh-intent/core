
import { Tokens } from '../../parser/Tokens';
import { ASTBuilder } from '../../ASTBuilder';
import { ChipNode } from '../ast/ChipNode';
import { QualifierBuilder, QualifierChildren } from './QualifierBuilder';
import { TypeBuilder } from './TypeBuilder';
import { PropertyBuilder, PropertyChildren } from './PropertyBuilder';
import { UseBuilder, UseChildren } from './UseBuilder';
import { TypeDefBuilder, TypeDefChildren } from './TypeDefBuilder';
import { CanBuilder, CanChildren } from './CanBuilder';
import { DomainBuilder, DomainChildren } from './DomainBuilder';
import { ChipBuilder, ChipChildren } from './ChipBuilder';

export class IntentBuilder implements ASTBuilder<ChipNode> {
  private builders:
    QualifierChildren &
    UseChildren &
    TypeDefChildren &
    TypeDefChildren &
    PropertyChildren &
    CanChildren &
    DomainChildren &
    ChipChildren &
    {
      chip: ChipBuilder;
    } = <any>{}
  ;

  public constructor() {
    this.builders.qualifier = new QualifierBuilder(this.builders);
    this.builders.type = new TypeBuilder(this.builders);
    this.builders.property = new PropertyBuilder(this.builders);
    this.builders.use = new UseBuilder(this.builders);
    this.builders.can = new CanBuilder(this.builders);
    this.builders.typedef = new TypeDefBuilder(this.builders);
    this.builders.domain = new DomainBuilder(this.builders);
    this.builders.chip = new ChipBuilder(this.builders);
  }

  public build(tokens: Tokens): ChipNode {
    return this.builders.chip.build(tokens);
  }
}

