export class Range {
  from: number;
  to: number;
}

export class Origin {
  public source: Source;
  public line: number;
  public column: number;

  public constructor(source: Source, line: number, column: number) {
    this.source = source;
    this.line = line;
    this.column = column;
  }
}

export class Source {
  public readonly content: string;
  public readonly reference: any;

  public extract(start: number, end: number): string {
    return this.content.substr(start, end - start);
  }

  public at(index: number): string {
    return this.content.charAt(index);
  }

  public range(): Range {
    return { from: 0, to: this.content.length };
  }

  public location(pos: number): Origin {
    let line = 1;
    let col = 1;
    let i = 0;

    while (i < pos) {
      if (this.at(i++) === '\n') {
        line++;
        col = 1;
      } else {
        col++;
      }
    }

    return new Origin(
      this,
      line,
      col,
    );
  }

  public position({ line, column }: Origin): number {
    if ((line == 1) && (column == 1)) {
      return 0;
    }

    const len = this.content.length;
    let currentLine = 1;
    let currentCol = 1;
    let i = 0;

    while (i < len) {
      if (this.at(i++) === '\n') {
        currentLine++;
        currentCol = 1;
      } else {
        currentCol++;
      }

      if ((line === currentLine) && (column === currentCol)) {
        return i;
      }
    }

    return len;
  }
}
