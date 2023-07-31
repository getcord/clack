import type { PlatformOrganizationVariables } from '@cord-sdk/api-types';
import type { Request, Response } from 'express';
import { ORG_ID } from 'src/server/consts';
import { fetchCordRESTApi } from '../fetchCordRESTApi';

export async function handleGetCordUsers(_: Request, res: Response) {
  const org = await fetchCordRESTApi<PlatformOrganizationVariables>(
    `organizations/${ORG_ID}`,
  );
  res.send(org.members);
}
