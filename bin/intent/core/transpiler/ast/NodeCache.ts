import { IntentModule } from '../../kernel/IntentModule';

export class NodeCache {
  private cache: {[path: string]: IntentModule} = {};

  public get(path: string): IntentModule {
    return this.cache[path];
  }

  public set(chip: IntentModule): IntentModule {
    this.cache[chip.identifier] = chip;

    return chip;
  }

  public all(): IntentModule[] {
    return Object.values(this.cache);
  }

  public has(chip: IntentModule): boolean {
    return !!this.cache[chip.identifier];
  }
}
