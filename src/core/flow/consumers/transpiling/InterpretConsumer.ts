
import * as fs from 'fs';
import * as path from 'path';
import { CoreEvent } from '../../CoreEvent';
import { AbstractConsumer } from '../../AbstractConsumer';

import { CompiledEvent } from '../../events/CompiledEvent';
import { InterpretedEvent } from '../../events/InterpretedEvent';
import { StringSource } from '../../../source/StringSource';
import { CoreEventBus } from '../../CoreEventBus';
import { ChipTranspiler } from './intentlang/templates/ChipTranspiler';
import { Compiler } from './compiler/Compiler';
import { Sampler } from './compiler/Sampler';
import { Template } from './Template';
import { Substitutor } from './Substitutor';
import { Strings } from '../../../../intent-utils/Strings';
import { CoreOptions } from '../../../../Core';

export interface EmitOptions {
  extension: string;
}

export interface InterpreterOptions {
  emit: EmitOptions;
}

export class InterpretConsumer extends AbstractConsumer<CompiledEvent, any>{
  private compiler: Compiler<any, string[]>;
  private sampler: Sampler;
  private substitutor: Substitutor<any>;
  private options: CoreOptions;
  private transpiler: ChipTranspiler;

  public constructor(bus: CoreEventBus, options: CoreOptions) {
    super(bus);
    this.options = options;
    this.sampler = new Sampler('{%', '%}');
    this.substitutor = new Substitutor(this.sampler);
    this.compiler = new Compiler(
      this.sampler,
      (code, resolver) => (
        new Template(code, this.substitutor, resolver)
      )
    );
    this.transpiler = new ChipTranspiler(this.compiler);
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === CompiledEvent.type();
  }

  public process(event: CompiledEvent) {
    let { chip } = event.data;
    this.stat(event, {
      type: 'interpret',
      chip,
    });

    let content = this.transpiler.transpile(chip.ast);

    let paths = this.options.resolver.paths;
    let emit = chip.path.replace(/\.int$/, this.options.interpreter.emit.extension);

    let root = paths.project;
    let append = "";

    if (emit.indexOf(paths.intent) >= 0) {
      root = paths.intent;
      append = "@lib";
    }

    let base = Strings.longestCommon([emit, root])
      .pop()
      .replace(new RegExp(`\\${path.sep}$`), '')
    ;
    let resolved = emit.replace(base, path.join(paths.output, append));
    let dir = path.dirname(resolved);

    this.assumeDir(dir)
      .then(() => {
        this.emit(new InterpretedEvent({
          chip,
          content: new StringSource(
            content.join("\n"),
            resolved
          ),
        }));
      });
  }

  protected assumeDir(dir): Promise<string> {
    return new Promise((rs, rj) => {
      try {
        fs.exists(dir, (exists) => {
          if (exists) {
            return rs(dir);
          }

          this.assumeDir(path.dirname(dir))
            .then(() => {
              fs.mkdir(dir, (e) => e ? rj(e) : rs(dir))
            })
            .catch(rj)
          ;
        });
      } catch (e) {
        rj(e);
      }
    }).catch((e) => {
      if (e instanceof Error) {
        if (e.message.match(/EEXIST/)) {
          return;
        }
      }

      throw e;
    });
  };
}
