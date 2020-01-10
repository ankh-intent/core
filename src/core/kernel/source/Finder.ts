
import fs = require('fs');
import path = require('path');

import { UnitMatcher } from '../../utils/UnitMatcher';

type PathConsumer<T> = (path: string) => T|undefined;

export class Finder {
  private readonly exclude: PathConsumer<boolean>[];

  constructor(exclude: PathConsumer<boolean>[] = [path => !path.startsWith('.')]) {
    this.exclude = exclude;
  }

  protected accept(path: string): boolean {
    for (const filter of this.exclude) {
      if (!filter(path)) {
        return false;
      }
    }

    return true;
  }

  public find<T>(root: string, matcher: UnitMatcher, consumer?: PathConsumer<T>): T | undefined {
    if (root.match(matcher.pattern) && this.accept(root)) {
      return (
        consumer
          ? consumer(root)
          : root as any
      );
    }
  }

  public dir<T>(root: string, matcher: UnitMatcher, consumer: PathConsumer<T>): T | undefined {
    if (fs.statSync(root).isFile()) {
      return;
    }

    const entries = fs.readdirSync(root);

    for (const entry of entries) {
      const found = this.accept(entry) && consumer(path.join(root, entry));

      if (found) {
        return found;
      }
    }
  }
}

export class RecursiveFinder extends Finder {
  public find<T>(root: string, matcher: UnitMatcher, consumer?: PathConsumer<T>): T | undefined {
    return super.find(root, matcher, consumer) || this.dir(root, matcher, (entry) => (
      this.find(entry, matcher, consumer)
    ));
  }
}

export class BubblingFinder extends Finder {
  public find<T>(root: string, matcher: UnitMatcher, consumer?: PathConsumer<T>): T | undefined {
    const found = super.find(root, matcher, consumer) || this.dir(root, matcher, (entry) => (
      super.find(entry, matcher, consumer)
    ));

    if (found) {
      return found;
    }

    const parent = path.dirname(root);

    return parent && this.find(parent, matcher, consumer);
  }
}
