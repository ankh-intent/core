
import { UnitMatcher } from './intent-watchdog/core/matcher/UnitMatcher';
import { Watchdog, WatchdogOptions } from './intent-watchdog/core/Watchdog';
import { WatchItem } from './intent-watchdog/core/WatchItem';
import { UnitInterface } from './intent-watchdog/core/Unit';
import { Chip } from './core/chips/Chip';
import { TreeNodeWalker } from './core/tree/TreeNodeVisitor';
import { StringSource } from './core/source/StringSource';
import { Compiler } from './core/Compiler';
import { ASTBuilder } from "./core/ASTBuilder";
import { Source } from './core/source/Source';
import { Emitter } from './intent-utils/Emitter';
import { ChipNode } from './core/ast/ChipNode';
import { Watch } from './intent-watchdog/core/aggregator/Watch';
import { FileReader } from './core/source/FileReader';

export interface CoreOptions {
  files: UnitMatcher[]
  watch?: WatchdogOptions;
}

let root: Chip = (() => {
  type ChipDef = {
    path?: string;
    linked?: {[name: string]: ChipDef};
  };

  let build = (def: ChipDef) => {
    let chip = new Chip(def.path);

    for (let name in def.linked) {
      chip.link(name, build(def.linked[name]));
    }

    return chip;
  };

  return build({
    linked: {
      Core: {
        path: '/Users/ankh/dev/js/intent/intent-core/src/Core.ts',
        linked: {
          moduleA_0: {},
          Chip: {
            path: '/Users/ankh/dev/js/intent/intent-core/src/core/chips/Chip.ts',
          },
        },
      },
      moduleB: {
      },
      moduleC: {
        linked: {
          moduleC_0: {
            linked: {
              moduleC_0_0: {
                linked: {
                  moduleC_0_0_0: {},
                },
              },
              moduleC_0_1: {},
            },
          },
        },
      },
    },
  });
})();

export class Core {
  private watchdog: Watchdog<UnitInterface>;
  private watches: WatchItem<UnitInterface>[];

  private files: UnitMatcher[];

  private compiler: Compiler;
  private sources: {
    [path: string]: {
      source: Source;
      chip: Chip;
    }
  } = {
    'bin/test.int': {
      source: new StringSource(`
      chip "aaa" {
        use Intent.Types as I;
        use Intent.Env as E;
      }
      `),
      chip: null,
    }
  };
  private queue: CompilationQueue;

  public constructor() {
    this.watches = [];
    this.compiler = new Compiler(new ASTBuilder());
    this.queue = new CompilationQueue(this.compiler);
    this.queue.and((path, ast) => {
      this.bind(path, ast);
    });
  }

  public bootstrap(options: CoreOptions): Core {
    let watch;

    this.files = options.files;

    if (watch = options.watch) {
      this.watchdog = new Watchdog(watch);

      this.watch(this.files);
    }

    if (this.watchdog) {
      this.watchdog.start(this.watches);
    }

    return this;
  }

  public stop() {
    if (this.watchdog) {
      this.watchdog.stop();
    }
  }

  protected watch(files: UnitMatcher[]) {
    let watchers = files.map((file) => this.watchdog.watch(file));

    for (let watcher of watchers) {
      watcher.emitter
        .and(this.event.bind(this))
      ;

      this.watches.push(watcher);
    }
  }

  protected event(data) {
    for (let { event, path } of data) {
      switch (event) {
        case 'change':
          this.changed(path);
          break;
      }
    }
  }

  protected changed(path) {
    this.queue.enqueue(path);
  }

  protected bind(path, ast: ChipNode) {
    console.log('parsed', path, ast);

    // let walker = new TreeNodeWalker<Chip>();
    // let visitors = {
    //   chip(node: Chip, { name, queue }: { name: string, queue: {name: string, chip: Chip}[] }) {
    //     let children = [];
    //
    //     for (let name in node.linked) {
    //       walker.walk(node.linked[name], visitors, {
    //         name,
    //         queue: children,
    //       });
    //     }
    //
    //     queue.push(...children);
    //
    //     if (node.path === path) {
    //       queue.push({
    //         chip: node,
    //         name,
    //       });
    //     } else {
    //       if (children.length) {
    //         queue.push({
    //           chip: node,
    //           name,
    //         });
    //       }
    //     }
    //   },
    // };
    //
    // let queue = [];
    // walker.walk(root, visitors, {
    //   name: 'root',
    //   queue,
    // });
    //
    // console.log('queue:', queue.map(({ chip, name }) => ({
    //   name,
    //   path: chip.path,
    // })));
  }
}

class CompilationQueue extends Emitter<(path: string, ast: ChipNode) => any> {
  private queue: string[];
  private compiler: Compiler;
  private watch: Watch;
  private reader: FileReader;

  public constructor(compiler: Compiler) {
    super();
    this.queue = [];
    this.compiler = compiler;
    this.reader = new FileReader();
    this.watch = new Watch(this.process.bind(this));
  }

  private bounce() {
    return this.watch.bounce(50);
  }

  public enqueue(path: string): number {
    let idx = (this.queue.indexOf(path) < 0)
      ? this.queue.push(path)
      : 0;

    if (idx) {
      this.bounce();
    }

    return idx;
  }

  public process() {
    if (!this.queue.length) {
      return;
    }

    let path = this.queue.shift();

    console.log('processing:', path);

    this.reader.read(path)
      .then((source: Source) => {
        this.emit(
          path,
          this.compiler.compile(source)
        );
      })
      .catch((error) => {
        console.log('failed:', path, error);
      })
      .then(() => {
        if (this.queue.length) {
          this.bounce();
        }
      })
    ;
  }
}
