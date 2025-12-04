export function partition<T>(
  arr: T[],
  predicate: (item: T) => boolean,
): [T[], T[]] {
  const trueGroup: T[] = [];
  const falseGroup: T[] = [];

  for (const item of arr) {
    if (predicate(item)) {
      trueGroup.push(item);
    } else {
      falseGroup.push(item);
    }
  }
  return [trueGroup, falseGroup];
}

export function accumulate<T>(arr: T[], predicate: (item: T) => number) {
  return arr.reduce((res, acc) => (res += predicate(acc)), 0);
}
