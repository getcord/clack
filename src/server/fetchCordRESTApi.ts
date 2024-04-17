import { fetchCordRESTApi as serverFetchCordRESTApi } from '@cord-sdk/server';
import {
  CORD_APP_ID,
  CORD_SIGNING_SECRET,
  CORD_API_URL,
} from 'src/server/consts';

export async function fetchCordRESTApi<T>(
  endpoint: string,
  method: 'GET' | 'PUT' | 'POST' | 'DELETE' = 'GET',
  body?: string | object,
): Promise<T> {
  return await serverFetchCordRESTApi(`v1/${endpoint}`, {
    method,
    project_id: CORD_APP_ID,
    project_secret: CORD_SIGNING_SECRET,
    api_url: CORD_API_URL,
    body,
  });
}
