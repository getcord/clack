import { useEffect, useState } from 'react';

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

// Shamelessly stolen from the testbed
export function useStateWithLocalStoragePersistence<T>(
  key: string,
): readonly [
  T | undefined,
  React.Dispatch<React.SetStateAction<T | undefined>>,
];

export function useStateWithLocalStoragePersistence<T>(
  key: string,
  defaultValue: T,
): readonly [T, React.Dispatch<React.SetStateAction<T>>];

export function useStateWithLocalStoragePersistence<T>(
  key: string,
  defaultValue?: T,
) {
  const [value, setValue] = useState(() => {
    const localStorageValue = localStorage.getItem(key);
    if (localStorageValue === null) {
      return defaultValue;
    }

    return JSON.parse(localStorageValue) as T;
  });

  useEffect(() => {
    if (value !== null && value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
