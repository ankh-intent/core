"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Source {
    extract(start, end) {
        return this.content.substr(start, end - start);
    }
    at(index) {
        return this.content.charAt(index);
    }
    range() {
        return { from: 0, to: this.content.length };
    }
}
exports.Source = Source;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvcmUvc291cmNlL1NvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBO0lBSVMsT0FBTyxDQUFDLEtBQWEsRUFBRSxHQUFXO1FBQ3ZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFTSxFQUFFLENBQUMsS0FBYTtRQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVNLEtBQUs7UUFDVixNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzlDLENBQUM7Q0FDRjtBQWZELHdCQWVDIn0=