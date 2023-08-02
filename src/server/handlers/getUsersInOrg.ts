import type { ServerOrganizationData } from '@cord-sdk/types';
import type { Request, Response } from 'express';
import { fetchCordRESTApi } from 'src/server/fetchCordRESTApi';
import { ORG_ID } from 'src/server/consts';

export async function handleGetCordUsers(_: Request, res: Response) {
  const org = await fetchCordRESTApi<ServerOrganizationData>(
    `organizations/${ORG_ID}`,
  );
  res.send(org.members);
}
