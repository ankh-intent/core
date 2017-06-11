"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractNode_1 = require("./AbstractNode");
class QualifierNode extends AbstractNode_1.AbstractNode {
    deepest() {
        return this.child
            ? this.child.deepest()
            : this.name;
    }
}
exports.QualifierNode = QualifierNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVhbGlmaWVyTm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL2FzdC9RdWFsaWZpZXJOb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsaURBQThDO0FBRTlDLG1CQUEyQixTQUFRLDJCQUFZO0lBSXRDLE9BQU87UUFDWixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUs7Y0FDYixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRTtjQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDRjtBQVRELHNDQVNDIn0=