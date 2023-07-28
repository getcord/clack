import type { ThreadVariables } from '@cord-sdk/api-types';
import type { Request, Response } from 'express';
import { ORG_ID } from 'src/server/consts';
import { fetchCordRESTApi } from '../fetchCordRESTApi';

export async function handleGetMyCordThreads(_: Request, res: Response) {
  const allThreads = await fetchCordRESTApi<ThreadVariables[]>('threads');
  const myThreads = allThreads.filter(
    //notes: would have been useful to filter this directly in the filters
    (thread: ThreadVariables) => thread.organizationID === ORG_ID,
  );

  res.send(myThreads);
}
