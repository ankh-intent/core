"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TreeNodeVisitor_1 = require("../tree/TreeNodeVisitor");
class ChipNodeWalker extends TreeNodeVisitor_1.TreeNodeWalker {
    walk(node, visitors, context) {
        for (let name in node.linked) {
            this.walk(node.linked[name], visitors, {
                name,
                context,
            });
        }
        return super.walk(node, visitors, context);
    }
}
exports.ChipNodeWalker = ChipNodeWalker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hpcE5vZGVXYWxrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29yZS9jaGlwcy9DaGlwTm9kZVdhbGtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDZEQUEyRTtBQUczRSxvQkFBNEIsU0FBUSxnQ0FBb0I7SUFFL0MsSUFBSSxDQUFDLElBQVUsRUFBRSxRQUFnQyxFQUFFLE9BQWE7UUFDckUsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRTtnQkFDckMsSUFBSTtnQkFDSixPQUFPO2FBQ1IsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDN0MsQ0FBQztDQUVGO0FBYkQsd0NBYUMifQ==