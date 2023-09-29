import type { ServerUserData } from '@cord-sdk/types';
import type { Request, Response } from 'express';
import { fetchCordRESTApi } from 'src/server/fetchCordRESTApi';

export async function handleAddChannel(req: Request, res: Response) {
  const { user_id: requesterID } = (req as any).loginTokenData;
  const { channelName } = req.params;
  const { isPrivate } = req.body;

  // If userIDs is sent, it's a private channel, which means we need to create
  // an org for its participants.  If no userIDs are sent, it's a public channel
  // which means it will be associated with the clack_all org.

  if (isPrivate) {
    await fetchCordRESTApi<
      Promise<{
        success: boolean;
        message: string;
      }>
    >(
      `organizations/${channelName}`,
      'PUT',
      JSON.stringify({
        name: channelName,
        members: [requesterID],
      }),
    );
  }

  const existingChannels = (
    await fetchCordRESTApi<ServerUserData>(`users/all_channels_holder`, 'GET')
  ).metadata;

  const response = await fetchCordRESTApi<
    Promise<{
      success: boolean;
      message: string;
    }>
  >(
    `users/all_channels_holder`,
    'PUT',
    JSON.stringify({
      metadata: {
        [channelName]: isPrivate ? channelName : 'clack_all',
        ...existingChannels,
      },
    }),
  );

  res.send({ success: response.success });
}
