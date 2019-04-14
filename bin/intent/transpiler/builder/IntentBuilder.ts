import { TokenVisitor } from '@intent/kernel/ast/TokenVisitor';
import { Tokens } from '@intent/kernel/parser/Tokens';

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
import { BuilderInvokers, BuildInvoker } from './BaseBuilder';

interface IntentChildren {
  chip: BuildInvoker<ChipNode>;
}

type IntentGrammar =
  QualifierChildren &
  UseChildren &
  TypeDefChildren &
  TypeDefChildren &
  PropertyChildren &
  CanChildren &
  ConstraintChildren &
  DomainChildren &
  ChipChildren &
  IntentChildren
  ;

type InvokableVisitors<T> = {[name in keyof T]: TokenVisitor<any>};

export class IntentBuilder implements TokenVisitor<ChipNode> {
  private readonly builders: InvokableVisitors<IntentGrammar>;
  private readonly invokers: BuilderInvokers<IntentGrammar>;

  public constructor() {
    this.invokers = <any>{};
    this.builders = {
      qualifier : new QualifierBuilder(this.invokers),
      type      : new TypeBuilder(this.invokers),
      property  : new PropertyBuilder(this.invokers),
      use       : new UseBuilder(this.invokers),
      can       : new CanBuilder(this.invokers),
      constraint: new ConstraintBuilder(this.invokers),
      typedef   : new TypeDefBuilder(this.invokers),
      domain    : new DomainBuilder(this.invokers),
      chip      : new ChipBuilder(this.invokers),
    };

    for (const builder of Object.keys(this.builders)) {
      const visitor = this.builders[builder];

      this.invokers[builder] = visitor.visit.bind(visitor);
    }
  }

  public visit(tokens: Tokens): ChipNode {
    return this.invokers.chip(tokens);
  }
}

