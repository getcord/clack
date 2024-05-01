import type { CoreThreadData } from '@cord-sdk/types';
import type { Request, Response } from 'express';
import { fetchCordRESTApi } from 'src/server/fetchCordRESTApi';
import { EVERYONE_ORG_ID } from 'src/common/consts';

export async function handleGetMyCordThreads(_: Request, res: Response) {
  const allThreads = await fetchCordRESTApi<CoreThreadData[]>('threads');
  const myThreads = allThreads.filter(
    //notes: would have been useful to filter this directly in the filters
    (thread: CoreThreadData) => thread.groupID === EVERYONE_ORG_ID,
  );

  res.send(myThreads);
}
