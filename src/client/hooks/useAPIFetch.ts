import { useState, useEffect } from 'react';
import { API_HOST } from 'src/client/consts/consts';

export function useAPIFetch<T extends object = object>(
  path: string,
): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined);

  useEffect(() => {
    fetch(`${API_HOST}${path}`, {
      credentials: 'include',
    })
      .then((resp) => resp.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.error('useAPIFetch error', error));
  }, [path]);

  return data;
}

export function useAPIUpdateFetch() {
  return (
    path: string,
    method: 'PUT' | 'POST' | 'DELETE' = 'POST',
    body?: { [key: string]: any },
  ): Promise<Response> => {
    return fetch(`${API_HOST}${path}`, {
      method,
      credentials: 'include',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((resp) => resp.json())
      .catch((error) => console.error('useAPIFetch error', error));
  };
}
