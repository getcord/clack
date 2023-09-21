import type { Request, Response } from 'express';
import { fetchCordRESTApi } from 'src/server/fetchCordRESTApi';

export async function handleAddOrgMember(req: Request, res: Response) {
  const response = await fetchCordRESTApi<
    Promise<{
      success: boolean;
      message: string;
    }>
  >(
    `organizations/${req.params.orgID}/members`,
    'POST',
    JSON.stringify({ add: [req.params.userID] }),
  );

  res.send(response.success);
}

export async function handleRemoveOrgMember(req: Request, res: Response) {
  const response = await fetchCordRESTApi<
    Promise<{
      success: boolean;
      message: string;
    }>
  >(
    `organizations/${req.params.orgID}/members`,
    'POST',
    JSON.stringify({ remove: [req.params.userID] }),
  );
  res.send(response.success);
}
