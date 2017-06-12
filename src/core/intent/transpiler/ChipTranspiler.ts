
import { Transpiler } from '../../flow/transpiler/Transpiler';
import { ChipNode } from '../ast/ChipNode';
import { DomainsTranspiler } from './DomainsTranspiler';
import { CanTranspiler } from './CanTranspiler';
import { UsesTranspiler } from './UsesTranspiler';

export class ChipTranspiler extends Transpiler<ChipNode, string> {
  private uses: UsesTranspiler = new UsesTranspiler();
  private domains: DomainsTranspiler = new DomainsTranspiler();
  private can: CanTranspiler = new CanTranspiler();

  public process(chip: ChipNode) {
    return `\n(() => ({\n` +
      this.nested.format(
        `${chip.name}: () => {\n` +
        this.nested.format(
          this.uses.process(chip.uses).concat(
            this.domains.process(chip.domains)
          ).join("\n") +
          `\nreturn {\n${chip.can ? this.nested.format(this.can.process(chip.can)) : ''}\n};`
        ) +
        `\n},\n`
      ) +
      `\n}))();\n`;
  }
}
