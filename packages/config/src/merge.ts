export const regexpify = (r: RegExp | string) => {
  return (typeof r === 'string')
    ? r
    : String(r).replace('\\\\', '\\');
};

const isMergeable = (o: any) => {
  return (!!(o && (o === Object(o)))) && !((o instanceof Date) || (o instanceof RegExp));
};

export const merge = (...os) => {
  const target = {};

  for (const o of os) {
    for (const [key, value2] of Object.entries(o)) {
      const value1 = target[key];
      const o1 = isMergeable(value1);
      const o2 = isMergeable(value2);

      target[key] = (o1 && o2)
        ? merge(value1, value2)
        : value2
      ;
    }
  }

  return target;
};
