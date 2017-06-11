#!/usr/bin/env node

import { Core, CoreOptions } from '../src/Core';
import { ErrorEvent } from '../src/core/flow/events/ErrorEvent';
import { SyntaxError } from '../src/core/parser/SyntaxError';
import { InterpretedEvent } from '../src/core/flow/events/InterpretedEvent';

let report = (error) => {
  if (error instanceof SyntaxError) {
    let loc = error.source.location(error.pos);
    console.error(`[INTENT/ERROR]: ${error.source.reference}:${loc.line}:${loc.column}: ${error.toString()}`);
    console.error(error.stack);
  } else {
    console.error(`[INTENT/ERROR]:`, error);
  }
};

(new Core()).bootstrap(<CoreOptions>{
  files: [
    {
      event: 'change',
      pattern: /\.int$/ig,
    }
  ],
  watch: {
    aggregation: 400,
  },
}).and((event) => {
  let { type, data} = event;

  switch (type) {
    case InterpretedEvent.type():
      console.log(data.content);
      break;

    case ErrorEvent.type():
      while (event) {
        if (event.type === ErrorEvent.type()) {
          report(data.error);
          event = data.parent;
        } else {
          break;
        }
      }
      break;

    default:
      console.log(`[INTENT/${type}]:`, JSON.stringify(data));
  }
});
