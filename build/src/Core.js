"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Watchdog_1 = require("./intent-watchdog/core/Watchdog");
const Chip_1 = require("./core/chips/Chip");
const TreeNodeVisitor_1 = require("./core/tree/TreeNodeVisitor");
let root = (() => {
    let build = (def) => {
        let chip = new Chip_1.Chip(def.path);
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
            moduleB: {},
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
class Core {
    constructor() {
        this.watches = [];
    }
    bootstrap(options) {
        let watch;
        this.files = options.files;
        if (watch = options.watch) {
            this.watchdog = new Watchdog_1.Watchdog(watch);
            this.watch(this.files);
        }
        if (this.watchdog) {
            this.watchdog.start(this.watches);
        }
        return this;
    }
    stop() {
        if (this.watchdog) {
            this.watchdog.stop();
        }
    }
    watch(files) {
        let watchers = files.map((file) => this.watchdog.watch(file));
        for (let watcher of watchers) {
            watcher.emitter
                .and(this.event.bind(this));
            this.watches.push(watcher);
        }
    }
    event(data) {
        for (let { event, path } of data) {
            switch (event) {
                case 'change':
                    this.changed(path);
                    break;
            }
        }
    }
    changed(path) {
        console.log('changed:', path);
        let walker = new TreeNodeVisitor_1.TreeNodeWalker();
        let visitors = {
            chip(node, { name, queue }) {
                let children = [];
                for (let name in node.linked) {
                    walker.walk(node.linked[name], visitors, {
                        name,
                        queue: children,
                    });
                }
                queue.push(...children);
                if (node.path === path) {
                    queue.push({
                        chip: node,
                        name,
                    });
                }
                else {
                    if (children.length) {
                        queue.push({
                            chip: node,
                            name,
                        });
                    }
                }
            },
        };
        let queue = [];
        walker.walk(root, visitors, {
            name: 'root',
            queue,
        });
        console.log('queue:', queue.map(({ chip, name }) => ({
            name,
            path: chip.path,
        })));
    }
}
exports.Core = Core;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Db3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsOERBQTRFO0FBRzVFLDRDQUF5QztBQUN6QyxpRUFBNkQ7QUFPN0QsSUFBSSxJQUFJLEdBQVMsQ0FBQztJQU1oQixJQUFJLEtBQUssR0FBRyxDQUFDLEdBQVk7UUFDdkIsSUFBSSxJQUFJLEdBQUcsSUFBSSxXQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTlCLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUMsQ0FBQztJQUVGLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDWCxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLG1EQUFtRDtnQkFDekQsTUFBTSxFQUFFO29CQUNOLFNBQVMsRUFBRSxFQUFFO29CQUNiLElBQUksRUFBRTt3QkFDSixJQUFJLEVBQUUsOERBQThEO3FCQUNyRTtpQkFDRjthQUNGO1lBQ0QsT0FBTyxFQUFFLEVBQ1I7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsTUFBTSxFQUFFO29CQUNOLFNBQVMsRUFBRTt3QkFDVCxNQUFNLEVBQUU7NEJBQ04sV0FBVyxFQUFFO2dDQUNYLE1BQU0sRUFBRTtvQ0FDTixhQUFhLEVBQUUsRUFBRTtpQ0FDbEI7NkJBQ0Y7NEJBQ0QsV0FBVyxFQUFFLEVBQUU7eUJBQ2hCO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFFTDtJQU1FO1FBQ0UsSUFBSSxD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