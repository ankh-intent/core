#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ASTBuilder_1 = require("../src/core/ASTBuilder");
const Tokens_1 = require("../src/core/parser/Tokens");
const Tokenizer_1 = require("../src/core/parser/Tokenizer");
const StringSource_1 = require("../src/core/source/StringSource");
let source = new StringSource_1.StringSource(`
chip "aaa" {
  use Intent.types as I;
  use Intent.Env as E;
}
`);
let unwhitespace = (source, context) => {
    let token;
    while (token = Tokenizer_1.Intent.wrapped(source, context)) {
        if (token.type !== 'whitespace') {
            break;
        }
    }
    return token;
};
let builder = new ASTBuilder_1.ASTBuilder();
let tokens = new Tokens_1.Tokens((context) => unwhitespace(source, context), source.range());
try {
    let chip = builder.chip(tokens);
    console.log(chip);
}
catch (e) {
    console.error(e);
}
// import { Core, CoreOptions } from '../src/Core';
//
// (new Core()).bootstrap(<CoreOptions>{
//   files: [
//     {
//       event: 'change',
//       pattern: /\.ts$/ig,
//     }
//   ],
//   watch: {
//     aggregation: 400,
//   },
// });
//
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vYmluL2ludGVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSx1REFBb0Q7QUFDcEQsc0RBQW1EO0FBQ25ELDREQUErRDtBQUMvRCxrRUFBK0Q7QUFHL0QsSUFBSSxNQUFNLEdBQUcsSUFBSSwyQkFBWSxDQUFDOzs7OztDQUs3QixDQUFDLENBQUM7QUFFSCxJQUFJLFlBQVksR0FBRyxDQUFDLE1BQWMsRUFBRSxPQUFnQjtJQUNsRCxJQUFJLEtBQUssQ0FBQztJQUVWLE9BQU8sS0FBSyxHQUFHLGtCQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNoQyxLQUFLLENBQUM7UUFDUixDQUFDO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUM7QUFFRixJQUFJLE9BQU8sR0FBRyxJQUFJLHVCQUFVLEVBQUUsQ0FBQztBQUMvQixJQUFJLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FDckIsQ0FBQyxPQUFPLEtBQUssWUFBWSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsRUFDMUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUNmLENBQUM7QUFFRixJQUFJLENBQUM7SUFDSCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRWhDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEIsQ0FBQztBQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25CLENBQUM7QUFFRCxtREFBbUQ7QUFDbkQsRUFBRTtBQUNGLHdDQUF3QztBQUN4QyxhQUFhO0FBQ2IsUUFBUTtBQUNSLHlCQUF5QjtBQUN6Qiw0QkFBNEI7QUFDNUIsUUFBUTtBQUNSLE9BQU87QUFDUCxhQUFhO0FBQ2Isd0JBQXdCO0FBQ3hCLE9BQU87QUFDUCxNQUFNO0FBQ04sRUFBRSJ9