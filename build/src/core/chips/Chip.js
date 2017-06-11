"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Chip {
    constructor(path) {
        this.type = Chip.TYPE_CHIP;
        this.linked = {};
        this.path = path;
    }
    link(name, chip) {
        if (chip) {
            this.linked[name] = chip;
        }
        else {
            delete this.linked[name];
        }
    }
    has(chip) {
        if (this === chip) {
            return true;
        }
        for (let name in this.linked) {
            if (this.linked[name].has(chip)) {
                return true;
            }
        }
        return false;
    }
}
Chip.TYPE_CHIP = 'chip';
exports.Chip = Chip;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL2NoaXBzL0NoaXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQTtJQU9FLFlBQW1CLElBQVk7UUFKeEIsU0FBSSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUM7UUFFOUIsV0FBTSxHQUEyQixFQUFFLENBQUM7UUFHekMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVNLElBQUksQ0FBQyxJQUFZLEVBQUUsSUFBVTtRQUNsQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDM0IsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNCLENBQUM7SUFDSCxDQUFDO0lBRU0sR0FBRyxDQUFDLElBQVU7UUFDbkIsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRCxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM3QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZCxDQUFDO1FBQ0gsQ0FBQztRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDOztBQTlCYSxjQUFTLEdBQUcsTUFBTSxDQUFDO0FBRG5DLG9CQWdDQyJ9