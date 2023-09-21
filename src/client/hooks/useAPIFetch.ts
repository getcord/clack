import { useState, useEffect } from 'react';
import { API_HOST } from 'src/client/consts/consts';

export function useAPIFetch<T extends object = object>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined);

  useEffect(() => {
    fetch(`${API_HOST}${path}`, {
      credentials: 'include',
      method,
    })
      .then((resp) =>
        resp.ok
          ? resp.json()
          : resp.text().then((text) => {
              throw new Error(`Response is not okay: ${text}`);
            }),
      )
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.error('useAPIFetch error', error));
  }, [method, path]);

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
