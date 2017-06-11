"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TreeNodeWalker {
    walk(node, visitors, context) {
        let visitor = visitors[node.type];
        if (visitor) {
            let result = visitor(node, context);
            if (result !== undefined) {
                return result;
            }
        }
        return true;
    }
}
exports.TreeNodeWalker = TreeNodeWalker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJlZU5vZGVWaXNpdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvcmUvdHJlZS9UcmVlTm9kZVZpc2l0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFhQTtJQUVTLElBQUksQ0FBQyxJQUFPLEVBQUUsUUFBNkIsRUFBRSxPQUFhO1FBQy9ELElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbEMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNaLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFcEMsRUFBRSxDQUFDLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLE1BQU0sQ0FBVSxNQUFNLENBQUM7WUFDekIsQ0FBQztRQUNILENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUVGO0FBaEJELHdDQWdCQyJ9