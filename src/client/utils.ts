export function capitalize(string: string): string {
  return string
    .split(' ')
    .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(' ');
}

export function combine(combiner: string, items: string[]): string {
  if (!items) {
    return '';
  }
  if (items.length === 0) {
    return '';
  } else if (items.length === 1) {
    return items[0];
  } else if (items.length === 2) {
    return `${items[0]} ${combiner} ${items[1]}`;
  } else {
    return `${items.slice(0, -1).join(', ')} ${combiner} ${
      items[items.length - 1]
    }`;
  }
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
