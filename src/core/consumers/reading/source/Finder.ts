
import fs = require('fs');
import path = require('path');

import { UnitMatcher } from '../../../kernel/watchdog/matcher/UnitMatcher';

export class Finder {
  public find<T>(root: string, matcher: UnitMatcher, consumer: (path: string) => T): T {
    const stat = fs.statSync(root);

    if (!stat.isDirectory()) {
      if (root.match(matcher.pattern)) {
        return consumer(root);
      }
    } else {
      const entries = fs.readdirSync(root)
        .filter(item => !item.startsWith('.'))
      ;
      let found;

      for (let dir of entries) {
        found = this.find(path.join(root, dir), matcher, consumer);

        if (found) {
          return found;
        }
      }
    }
  }
}
