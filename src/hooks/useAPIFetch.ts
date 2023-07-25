import { useState, useEffect } from 'react';
import { API_HOST } from 'src/client/consts';

export function useAPIFetch<T extends object = object>(
  path: string,
): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined);
  useEffect(() => {
    fetch(`${API_HOST}${path}`)
      .then((resp) => resp.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.log('useAPIFetch error', error));
  }, [path]);

  return data;
}
