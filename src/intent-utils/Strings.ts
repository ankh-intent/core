
export class Strings {

  public static shrink(string: string, to: number, left: boolean = false) {
    return (string.length > to)
      ? string.substr(0, to - 3) + '...'
      : this.pad(string, to, ' ', left);
  }

  public static pad(string: string, to: number, pattern: string = ' ', left: boolean = false) {
    if (to <= string.length) {
      return string;
    }

    return left
      ? pattern.repeat(to - string.length) + string
      : string + pattern.repeat(to - string.length);
  }

  public static max(strings: string[]): number {
    return strings.reduce((max, line) => Math.max(max, line.length), 0);
  }

  public static longestCommon(strings: string[]): string[] {
    let subcommon = (a: string, b: string) => {
      let l = Math.min(a.length, b.length), i = 0;

      while (i < l && a.charAt(i) === b.charAt(i)) {
        i++;
      }

      return a.substring(0, i);
    };
    let intersect = [];

    for (let common1 of strings) {
      let subs = new Array(strings.length), i = 0;

      for (let common2 of strings) {
        if (common1 === common2) {
          continue;
        }

        subs[i++] = subcommon(common1, common2);
      }

      subs = subs.filter((s) => s.length);

      if (subs.length) {
        for (let sub of subs) {
          if (intersect.indexOf(sub) < 0) {
            intersect.push(sub);
          }
        }
      }
    }

    return ((intersect.length > 1) && (intersect.length !== strings.length))
      ? this.longestCommon(intersect)
      : intersect;
  }

  public static lookup(line, p, s) {
    while (p < line.length) {
      p = line.indexOf(s, p);

      if ((p > 0) && (line[p - 1] === '\\')) {
        p++;

        continue;
      }

      return p;
    }
  }

  public static unindent(lines: string[]): string[] {
    let first = lines[0], m;

    if (m = first.match(/^(\s*)/)) {
      let tab = m[1];
      let len = tab.length;

      lines = lines.map((line) => {
        return line.startsWith(tab)
          ? line.substr(len)
          : line;
      });
    }

    return lines;
  }

  static indent(lines: string[], pad: string): string[] {
    return lines.map((line) => pad + line);
  }
}
