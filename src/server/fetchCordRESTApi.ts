import { getServerAuthToken } from '@cord-sdk/server';
import {
  CORD_APP_ID,
  CORD_SIGNING_SECRET,
  CORD_API_URL,
} from 'src/server/consts';

export async function fetchCordRESTApi<T>(
  endpoint: string,
  method: 'GET' | 'PUT' | 'POST' | 'DELETE' = 'GET',
  body?: string,
): Promise<T> {
  const serverAuthToken = getServerAuthToken(CORD_APP_ID, CORD_SIGNING_SECRET);
  const response = await fetch(`${CORD_API_URL}${endpoint}`, {
    method,
    body,
    headers: {
      Authorization: `Bearer ${serverAuthToken}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}
