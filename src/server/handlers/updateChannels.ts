import type { ServerUserData } from '@cord-sdk/types';
import type { Request, Response } from 'express';
import { DM_CHANNEL_PREFIX } from 'src/common/consts';
import { EVERYONE_ORG_ID } from 'src/server/consts';
import { fetchCordRESTApi } from 'src/server/fetchCordRESTApi';

export async function handleAddChannel(req: Request, res: Response) {
  const { user_id: requesterID } = (req as any).loginTokenData;
  const { channelName } = req.params;
  const { isPrivate } = req.body;

  if (channelName.startsWith(DM_CHANNEL_PREFIX)) {
    const users = channelName
      .substring(DM_CHANNEL_PREFIX.length)
      .split(',')
      .sort();
    if (!users.includes(requesterID)) {
      res.status(403).send('Cannot create DM without you in it');
      return;
    }
    const result = await fetchCordRESTApi<
      Promise<{ success: boolean; message: string }>
    >(
      `groups/${encodeURIComponent(channelName)}`,
      'PUT',
      JSON.stringify({ name: channelName, members: users }),
    );
    res.send({ success: result.success });
    return;
  }

  const existingChannels = (
    await fetchCordRESTApi<ServerUserData>(`users/all_channels_holder`, 'GET')
  ).metadata;

  if (channelName in existingChannels) {
    res.status(403).send('Channel already exists');
    return;
  }

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
        [channelName]: isPrivate ? channelName : EVERYONE_ORG_ID,
        ...existingChannels,
      },
    }),
  );

  res.send({ success: response.success });
}
