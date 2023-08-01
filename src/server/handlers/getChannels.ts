import type { Request, Response } from 'express';
import type { PlatformUserVariables } from '@cord-sdk/api-types';
import { fetchCordRESTApi } from 'src/server/fetchCordRESTApi';

export async function handleGetChannels(_: Request, res: Response) {
  const allChannelsHolder = await fetchCordRESTApi<PlatformUserVariables>(
    'users/all_channels_holder',
  );

  const encodedChannels = String(
    allChannelsHolder.metadata?.channels ?? 'general',
  );

  res.send(encodedChannels.split('#'));
}
