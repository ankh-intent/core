#!/usr/bin/env node

import { ASTBuilder } from '../src/core/ASTBuilder';
import { Tokens } from '../src/core/parser/Tokens';
import { Context, Intent } from '../src/core/parser/Tokenizer';
import { StringSource } from '../src/core/source/StringSource';
import { Source } from '../src/core/source/Source';

let source = new StringSource(`
chip "aaa" {
  use Intent.types as I;
  use Intent.Env as E;
}
`);

let unwhitespace = (source: Source, context: Context) => {
  let token;

  while (token = Intent.wrapped(source, context)) {
    if (token.type !== 'whitespace') {
      break;
    }
  }

  return token;
};

let builder = new ASTBuilder();
let tokens = new Tokens(
  (context) => unwhitespace(source, context),
  source.range()
);

try {
  let chip = builder.chip(tokens);

  console.log(chip);
} catch (e) {
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
