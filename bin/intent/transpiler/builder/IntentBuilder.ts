import { Tokens } from '@intent/kernel/parser/Tokens';
import { ASTBuilder } from '@intent/consumers/ast-compiling/ASTBuilder';

import { ChipNode } from '../ast/ChipNode';
import { QualifierBuilder, QualifierChildren } from './QualifierBuilder';
import { TypeBuilder } from './TypeBuilder';
import { PropertyBuilder, PropertyChildren } from './PropertyBuilder';
import { UseBuilder, UseChildren } from './UseBuilder';
import { TypeDefBuilder, TypeDefChildren } from './TypeDefBuilder';
import { CanBuilder, CanChildren } from './CanBuilder';
import { DomainBuilder, DomainChildren } from './DomainBuilder';
import { ChipBuilder, ChipChildren } from './ChipBuilder';
import { ConstraintBuilder, ConstraintChildren } from './ConstraintBuilder';

export class IntentBuilder implements ASTBuilder<ChipNode> {
  private builders:
    QualifierChildren &
    UseChildren &
    TypeDefChildren &
    TypeDefChildren &
    PropertyChildren &
    CanChildren &
    ConstraintChildren &
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
    this.builders.constraint = new ConstraintBuilder(this.builders);
    this.builders.typedef = new TypeDefBuilder(this.builders);
    this.builders.domain = new DomainBuilder(this.builders);
    this.builders.chip = new ChipBuilder(this.builders);

    for (const name in this.builders) {
      const builder = this.builders[name];
      const old = builder.build.bind(builder);

      builder.build = (tokens: Tokens) => {
        const mark = tokens.push();

        try {
          const node = old(tokens);

          if (!node) {
            tokens.pop(mark);
          }

          return node;
        } catch (e) {
          tokens.pop(mark);

          throw tokens.error(`Failed @${name}`, e);
        }
      };
    }
  }

  public build(tokens: Tokens): ChipNode {
    return this.builders.chip.build(tokens);
  }
}

