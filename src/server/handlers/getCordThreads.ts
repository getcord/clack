import { getServerAuthToken } from '@cord-sdk/server';
import type { ThreadVariables } from '@cord-sdk/api-types';
import type { Request, Response } from 'express';

const CORD_THREADS_API_URL = 'https://api.cord.com/v1/threads/';
const CORD_APP_ID = process.env.CORD_APP_ID!;
const CORD_SIGNING_SECRET = process.env.CORD_SIGNING_SECRET!;

export async function handleGetMyCordThreads(req: Request, res: Response) {
  if (!CORD_APP_ID || !CORD_SIGNING_SECRET) {
    res.sendStatus(400);
    return;
  }

  const serverAuthToken = getServerAuthToken(CORD_APP_ID, CORD_SIGNING_SECRET);
  const response = await fetch(`${CORD_THREADS_API_URL}`, {
    headers: { Authorization: `Bearer ${serverAuthToken}` },
  });

  const myThreads = (await response.json()).filter(
    //notes: would have been useful to filter this directly in the filters
    (thread: ThreadVariables) => thread.organizationID === 'clack_all',
  );

  res.send(myThreads);
}
