import type { ThreadVariables } from '@cord-sdk/api-types';
import type { Request, Response } from 'express';
import { fetchCordRESTApi } from 'src/server/fetchCordRESTApi';
import { ORG_ID } from 'src/server/consts';

export async function handleGetMyCordThreads(_: Request, res: Response) {
  const allThreads = await fetchCordRESTApi<ThreadVariables[]>('threads');
  const myThreads = allThreads.filter(
    //notes: would have been useful to filter this directly in the filters
    (thread: ThreadVariables) => thread.organizationID === ORG_ID,
  );

  res.send(myThreads);
}
