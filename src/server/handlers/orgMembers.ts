import type { ServerOrganizationData } from '@cord-sdk/types';
import type { Request, Response } from 'express';
import { fetchCordRESTApi } from 'src/server/fetchCordRESTApi';

export async function handleAddOrgMember(req: Request, res: Response) {
  const { user_id: requesterID } = (req as any).loginTokenData;
  const { channelName } = req.params;
  const { userIDs } = req.body;
  if (!userIDs || !Array.isArray(userIDs)) {
    res.status(400).send('Missing userIDs in body or is not an array');
    return;
  }
  const hasPermission = await isUserInChannel(requesterID, channelName);

  if (!hasPermission) {
    res.sendStatus(401);
  }

  const response = await fetchCordRESTApi<
    Promise<{
      success: boolean;
      message: string;
    }>
  >(
    `organizations/${req.params.channelName}/members`,
    'POST',
    JSON.stringify({ add: userIDs }),
  );

  res.send({ success: response.success });
}

export async function handleRemoveOrgMember(req: Request, res: Response) {
  const { user_id: requesterID } = (req as any).loginTokenData;
  const { channelName } = req.params;
  const { userIDs } = req.body;
  if (!userIDs || !Array.isArray(userIDs)) {
    res.status(400).send('Missing userIDs in body or is not an array');
    return;
  }
  const hasPermission = await isUserInChannel(requesterID, channelName);

  if (!hasPermission) {
    res.sendStatus(401);
  }

  const response = await fetchCordRESTApi<
    Promise<{
      success: boolean;
      message: string;
    }>
  >(
    `organizations/${req.params.channelName}/members`,
    'POST',
    JSON.stringify({ remove: userIDs }),
  );
  res.send({ success: response.success });
}

async function isUserInChannel(userID: string, channel: string) {
  const allOrgUsers = (
    await fetchCordRESTApi<ServerOrganizationData>(`organizations/${channel}`)
  ).members;

  return !!allOrgUsers?.includes(userID);
}
