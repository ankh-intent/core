import { AbstractNode } from '@intent/kernel';

export enum LiteralType {
  String,
  Number,
}

export class LiteralNode extends AbstractNode {
  constructor(
    public value: string,
    public type: LiteralType,
  ) {
    super();
  }
}
