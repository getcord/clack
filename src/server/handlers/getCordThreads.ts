import { getServerAuthToken } from '@cord-sdk/server';
import type { ThreadVariables } from '@cord-sdk/api-types';
import type { Request, Response } from 'express';
import {
  CORD_APP_ID,
  CORD_SIGNING_SECRET,
  CORD_API_URL,
} from 'src/server/consts';

export async function handleGetMyCordThreads(_: Request, res: Response) {
  if (!CORD_APP_ID || !CORD_SIGNING_SECRET) {
    res.sendStatus(400);
    return;
  }

  const serverAuthToken = getServerAuthToken(CORD_APP_ID, CORD_SIGNING_SECRET);
  const response = await fetch(`${CORD_API_URL}threads/`, {
    headers: { Authorization: `Bearer ${serverAuthToken}` },
  });

  const myThreads = (await response.json()).filter(
    //notes: would have been useful to filter this directly in the filters
    (thread: ThreadVariables) => thread.organizationID === 'clack_all',
  );

  res.send(myThreads);
}
