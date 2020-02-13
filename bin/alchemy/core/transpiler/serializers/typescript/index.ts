import { RootSerializer } from '../RootSerializer';

import { DomainSerializer, DomainSerializerChildren } from './DomainSerializer';
import { FunctorSerializer, FunctorSerializerChildren } from './functor/FunctorSerializer';
import { FunctorArgsSerializer, FunctorArgsSerializerChildren } from './functor/FunctorArgsSerializer';
import { FunctorBodySerializer, FunctorBodySerializerChildren } from './functor/FunctorBodySerializer';
import { ModuleSerializer, ModuleNodeSerializerChildren } from './ModuleSerializer';
import { UsesSerializer, UsesSerializerChildren } from './UsesSerializer';
import { UseSerializer, UseSerializerChildren } from './UseSerializer';

type AlchemyGrammar =
  UseSerializerChildren &
  UsesSerializerChildren &
  FunctorSerializerChildren &
  FunctorArgsSerializerChildren &
  FunctorBodySerializerChildren &
  DomainSerializerChildren &
  ModuleNodeSerializerChildren
;

export class TypescriptSerializer extends RootSerializer<AlchemyGrammar> {
  protected get visitors() {
    return {
      root         : new ModuleSerializer(this.invokers),
      use          : new UseSerializer(this.invokers),
      uses         : new UsesSerializer(this.invokers),
      functor      : new FunctorSerializer(this.invokers),
      args         : new FunctorArgsSerializer(this.invokers),
      block        : new FunctorBodySerializer(this.invokers),
      domain       : new DomainSerializer(this.invokers),
    };
  }
}
