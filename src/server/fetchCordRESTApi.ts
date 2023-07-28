import { getServerAuthToken } from '@cord-sdk/server';
import {
  CORD_APP_ID,
  CORD_SIGNING_SECRET,
  CORD_API_URL,
} from 'src/server/consts';
import type { blah } from '@cord-sdk/api-types';

export async function fetchCordRESTApi<T>(endpoint: string): Promise<T> {
  const serverAuthToken = getServerAuthToken(CORD_APP_ID, CORD_SIGNING_SECRET);
  const response = await fetch(`${CORD_API_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${serverAuthToken}` },
  });

  return response.json();
}
